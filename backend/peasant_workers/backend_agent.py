from langgraph import StateGraph, END
from langchain_openai import ChatOpenAI
from typing import Dict, Any, List, Optional
import json
import logging
import asyncio
from datetime import datetime
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class TaskStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ProcessingStage(Enum):
    VALIDATION = "validation"
    PREPROCESSING = "preprocessing"
    PROCESSING = "processing"
    POSTPROCESSING = "postprocessing"
    STORAGE = "storage"
    NOTIFICATION = "notification"

@dataclass
class ProcessingRequest:
    request_id: str
    request_type: str
    data: Dict[str, Any]
    priority: int
    requester: str
    created_at: str
    deadline: Optional[str] = None
    metadata: Dict[str, Any] = None

@dataclass
class ProcessingResult:
    request_id: str
    status: TaskStatus
    result_data: Dict[str, Any]
    processing_time: float
    stages_completed: List[str]
    error_message: Optional[str] = None
    warnings: List[str] = None

class PeasantBackendAgent:
    """
    The Peasant Farmer Backend Agent handles data processing, business logic
    execution, and integration with external systems. It serves the system
    by performing the computational work required by higher-level agents.
    """
    
    def __init__(self, model_name: str = "gpt-3.5-turbo", temperature: float = 0.3):
        self.llm = ChatOpenAI(model=model_name, temperature=temperature)
        self.workflow = self.create_workflow()
        self.processing_queue = asyncio.Queue()
        self.active_tasks = {}
        self.completed_tasks = {}
        self.performance_metrics = {
            'total_processed': 0,
            'total_failed': 0,
            'average_processing_time': 0.0,
            'queue_length': 0
        }
        
    def create_workflow(self) -> StateGraph:
        """Create a stateful workflow for data processing operations."""
        workflow = StateGraph()
        
        # Define workflow nodes (processing stages)
        workflow.add_node("validate_input", self.validate_input)
        workflow.add_node("preprocess_data", self.preprocess_data)
        workflow.add_node("process_data", self.process_data)
        workflow.add_node("postprocess_data", self.postprocess_data)
        workflow.add_node("store_results", self.store_results)
        workflow.add_node("notify_completion", self.notify_completion)
        workflow.add_node("handle_error", self.handle_error)
        
        # Define conditional edges
        workflow.add_conditional_edges(
            "validate_input",
            self.should_continue_processing,
            {
                "continue": "preprocess_data",
                "error": "handle_error"
            }
        )
        
        workflow.add_conditional_edges(
            "preprocess_data",
            self.should_continue_processing,
            {
                "continue": "process_data",
                "error": "handle_error"
            }
        )
        
        workflow.add_conditional_edges(
            "process_data",
            self.should_continue_processing,
            {
                "continue": "postprocess_data",
                "error": "handle_error"
            }
        )
        
        workflow.add_conditional_edges(
            "postprocess_data",
            self.should_continue_processing,
            {
                "continue": "store_results",
                "error": "handle_error"
            }
        )
        
        # Linear edges for final stages
        workflow.add_edge("store_results", "notify_completion")
        workflow.add_edge("notify_completion", END)
        workflow.add_edge("handle_error", END)
        
        # Set entry point
        workflow.set_entry_point("validate_input")
        
        return workflow.compile()
    
    async def process_request(self, request: ProcessingRequest) -> ProcessingResult:
        """
        Process an incoming request through the complete workflow.
        
        Args:
            request: The processing request to handle
            
        Returns:
            ProcessingResult: Results of the processing operation
        """
        start_time = datetime.now()
        logger.info(f"Peasant Backend Agent processing request: {request.request_id}")
        
        # Initialize processing state
        state = {
            'request': request,
            'original_data': request.data.copy(),
            'processed_data': None,
            'validation_results': None,
            'processing_results': None,
            'storage_results': None,
            'error': None,
            'warnings': [],
            'stages_completed': [],
            'current_stage': 'validation'
        }
        
        # Add to active tasks
        self.active_tasks[request.request_id] = state
        
        try:
            # Execute the workflow
            result_state = await self.workflow.ainvoke(state)
            
            # Calculate processing time
            end_time = datetime.now()
            processing_time = (end_time - start_time).total_seconds()
            
            # Create result object
            if result_state.get('error'):
                status = TaskStatus.FAILED
                result_data = {'error': result_state['error']}
                error_message = result_state['error']
            else:
                status = TaskStatus.COMPLETED
                result_data = result_state.get('processing_results', {})
                error_message = None
            
            result = ProcessingResult(
                request_id=request.request_id,
                status=status,
                result_data=result_data,
                processing_time=processing_time,
                stages_completed=result_state.get('stages_completed', []),
                error_message=error_message,
                warnings=result_state.get('warnings', [])
            )
            
            # Store completed task
            self.completed_tasks[request.request_id] = result
            
            # Update metrics
            self._update_performance_metrics(result)
            
            logger.info(f"Request {request.request_id} completed in {processing_time:.2f}s")
            return result
            
        except Exception as e:
            logger.error(f"Unexpected error processing request {request.request_id}: {e}")
            return ProcessingResult(
                request_id=request.request_id,
                status=TaskStatus.FAILED,
                result_data={},
                processing_time=(datetime.now() - start_time).total_seconds(),
                stages_completed=state.get('stages_completed', []),
                error_message=str(e)
            )
        finally:
            # Remove from active tasks
            self.active_tasks.pop(request.request_id, None)
    
    async def validate_input(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Validate incoming request data and parameters."""
        request = state['request']
        state['current_stage'] = 'validation'
        
        logger.debug(f"Validating input for request {request.request_id}")
        
        try:
            # Basic validation checks
            validation_results = {
                'is_valid': True,
                'errors': [],
                'warnings': [],
                'sanitized_data': {}
            }
            
            # Check required fields
            if not request.data:
                validation_results['is_valid'] = False
                validation_results['errors'].append("No data provided")
            
            # Check data types and format
            if request.data:
                validation_results['sanitized_data'] = await self._sanitize_data(request.data)
            
            # Validate request type
            supported_types = ['data_analysis', 'data_transformation', 'computation', 'integration']
            if request.request_type not in supported_types:
                validation_results['warnings'].append(f"Request type '{request.request_type}' may not be fully supported")
            
            # Check data size limits
            data_size = len(json.dumps(request.data))
            if data_size > 1024 * 1024:  # 1MB limit
                validation_results['warnings'].append("Large data payload detected, processing may be slower")
            
            state['validation_results'] = validation_results
            state['stages_completed'].append('validation')
            
            if not validation_results['is_valid']:
                state['error'] = f"Validation failed: {', '.join(validation_results['errors'])}"
            
        except Exception as e:
            state['error'] = f"Validation error: {str(e)}"
            logger.error(f"Validation failed for request {request.request_id}: {e}")
        
        return state
    
    async def preprocess_data(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess and prepare data for main processing."""
        request = state['request']
        state['current_stage'] = 'preprocessing'
        
        logger.debug(f"Preprocessing data for request {request.request_id}")
        
        try:
            sanitized_data = state['validation_results']['sanitized_data']
            
            # Apply preprocessing based on request type
            if request.request_type == 'data_analysis':
                preprocessed_data = await self._preprocess_for_analysis(sanitized_data)
            elif request.request_type == 'data_transformation':
                preprocessed_data = await self._preprocess_for_transformation(sanitized_data)
            elif request.request_type == 'computation':
                preprocessed_data = await self._preprocess_for_computation(sanitized_data)
            else:
                preprocessed_data = sanitized_data  # No special preprocessing
            
            state['processed_data'] = preprocessed_data
            state['stages_completed'].append('preprocessing')
            
        except Exception as e:
            state['error'] = f"Preprocessing error: {str(e)}"
            logger.error(f"Preprocessing failed for request {request.request_id}: {e}")
        
        return state
    
    async def process_data(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the main data processing logic."""
        request = state['request']
        state['current_stage'] = 'processing'
        
        logger.debug(f"Processing data for request {request.request_id}")
        
        try:
            processed_data = state['processed_data']
            
            # Route to appropriate processing method
            if request.request_type == 'data_analysis':
                results = await self._perform_data_analysis(processed_data, request.metadata or {})
            elif request.request_type == 'data_transformation':
                results = await self._perform_data_transformation(processed_data, request.metadata or {})
            elif request.request_type == 'computation':
                results = await self._perform_computation(processed_data, request.metadata or {})
            elif request.request_type == 'integration':
                results = await self._perform_integration(processed_data, request.metadata or {})
            else:
                results = {'status': 'completed', 'data': processed_data}
            
            state['processing_results'] = results
            state['stages_completed'].append('processing')
            
        except Exception as e:
            state['error'] = f"Processing error: {str(e)}"
            logger.error(f"Processing failed for request {request.request_id}: {e}")
        
        return state
    
    async def postprocess_data(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Postprocess results and prepare for delivery."""
        request = state['request']
        state['current_stage'] = 'postprocessing'
        
        logger.debug(f"Postprocessing data for request {request.request_id}")
        
        try:
            processing_results = state['processing_results']
            
            # Apply postprocessing transformations
            postprocessed_results = {
                'request_id': request.request_id,
                'request_type': request.request_type,
                'results': processing_results,
                'metadata': {
                    'processed_at': datetime.now().isoformat(),
                    'processing_stages': state['stages_completed'],
                    'warnings': state.get('warnings', []),
                    'data_quality_score': self._calculate_data_quality_score(processing_results)
                }
            }
            
            # Format results based on requester preferences
            if request.metadata and request.metadata.get('format'):
                postprocessed_results = await self._format_results(
                    postprocessed_results, 
                    request.metadata['format']
                )
            
            state['processing_results'] = postprocessed_results
            state['stages_completed'].append('postprocessing')
            
        except Exception as e:
            state['error'] = f"Postprocessing error: {str(e)}"
            logger.error(f"Postprocessing failed for request {request.request_id}: {e}")
        
        return state
    
    async def store_results(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Store processing results for future reference."""
        request = state['request']
        state['current_stage'] = 'storage'
        
        logger.debug(f"Storing results for request {request.request_id}")
        
        try:
            processing_results = state['processing_results']
            
            # Store results (in a real implementation, this would use a database)
            storage_key = f"results_{request.request_id}"
            storage_results = {
                'storage_key': storage_key,
                'stored_at': datetime.now().isoformat(),
                'size_bytes': len(json.dumps(processing_results)),
                'retention_period': '30_days'  # Example retention policy
            }
            
            # In a real implementation, you would store to database/file system here
            logger.info(f"Results stored with key: {storage_key}")
            
            state['storage_results'] = storage_results
            state['stages_completed'].append('storage')
            
        except Exception as e:
            state['error'] = f"Storage error: {str(e)}"
            logger.error(f"Storage failed for request {request.request_id}: {e}")
        
        return state
    
    async def notify_completion(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Notify requesters about task completion."""
        request = state['request']
        state['current_stage'] = 'notification'
        
        logger.debug(f"Sending completion notification for request {request.request_id}")
        
        try:
            # Prepare notification data
            notification = {
                'request_id': request.request_id,
                'status': 'completed',
                'requester': request.requester,
                'completion_time': datetime.now().isoformat(),
                'results_available': True,
                'storage_key': state.get('storage_results', {}).get('storage_key')
            }
            
            # In a real implementation, this would send to message queue or notification service
            logger.info(f"Completion notification sent for request {request.request_id}")
            
            state['notification_results'] = notification
            state['stages_completed'].append('notification')
            
        except Exception as e:
            state['warnings'].append(f"Notification error: {str(e)}")
            logger.warning(f"Notification failed for request {request.request_id}: {e}")
        
        return state
    
    async def handle_error(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle errors that occur during processing."""
        request = state['request']
        error = state.get('error', 'Unknown error')
        
        logger.error(f"Handling error for request {request.request_id}: {error}")
        
        # Log error details
        error_details = {
            'request_id': request.request_id,
            'error_message': error,
            'failed_stage': state.get('current_stage', 'unknown'),
            'stages_completed': state.get('stages_completed', []),
            'timestamp': datetime.now().isoformat()
        }
        
        # In a real implementation, this would be logged to an error tracking system
        logger.error(f"Error details: {json.dumps(error_details, indent=2)}")
        
        # Attempt error recovery if possible
        recovery_attempted = await self._attempt_error_recovery(state)
        if recovery_attempted:
            state['warnings'].append("Error recovery attempted")
        
        return state
    
    def should_continue_processing(self, state: Dict[str, Any]) -> str:
        """Determine whether to continue processing or handle an error."""
        if state.get('error'):
            return "error"
        return "continue"
    
    # Data Processing Methods
    
    async def _perform_data_analysis(self, data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Perform data analysis operations."""
        analysis_type = metadata.get('analysis_type', 'basic')
        
        if analysis_type == 'statistical':
            return await self._statistical_analysis(data)
        elif analysis_type == 'trend':
            return await self._trend_analysis(data)
        else:
            return await self._basic_analysis(data)
    
    async def _perform_data_transformation(self, data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Perform data transformation operations."""
        transformation_type = metadata.get('transformation_type', 'standard')
        
        # Apply transformations based on type
        transformed_data = data.copy()
        
        if transformation_type == 'normalize':
            transformed_data = await self._normalize_data(transformed_data)
        elif transformation_type == 'aggregate':
            transformed_data = await self._aggregate_data(transformed_data)
        elif transformation_type == 'filter':
            filter_criteria = metadata.get('filter_criteria', {})
            transformed_data = await self._filter_data(transformed_data, filter_criteria)
        
        return {
            'status': 'transformed',
            'original_size': len(str(data)),
            'transformed_size': len(str(transformed_data)),
            'data': transformed_data
        }
    
    async def _perform_computation(self, data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Perform computational operations."""
        computation_type = metadata.get('computation_type', 'basic')
        
        if computation_type == 'mathematical':
            return await self._mathematical_computation(data, metadata)
        elif computation_type == 'optimization':
            return await self._optimization_computation(data, metadata)
        else:
            return await self._basic_computation(data)
    
    async def _perform_integration(self, data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Perform integration with external systems."""
        integration_type = metadata.get('integration_type', 'api')
        
        # Simulate integration operations
        integration_results = {
            'status': 'integrated',
            'integration_type': integration_type,
            'data_sent': len(str(data)),
            'timestamp': datetime.now().isoformat()
        }
        
        return integration_results
    
    # Utility Methods
    
    async def _sanitize_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize input data to prevent security issues."""
        # Basic sanitization - remove potentially harmful content
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, str):
                # Remove potential script tags or SQL injection patterns
                sanitized_value = value.replace('<script>', '').replace('</script>', '')
                sanitized_value = sanitized_value.replace('DROP TABLE', '').replace('DELETE FROM', '')
                sanitized[key] = sanitized_value
            elif isinstance(value, dict):
                sanitized[key] = await self._sanitize_data(value)
            else:
                sanitized[key] = value
        
        return sanitized
    
    async def _preprocess_for_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess data for analysis operations."""
        # Convert string numbers to actual numbers
        processed = {}
        for key, value in data.items():
            if isinstance(value, str) and value.replace('.', '').replace('-', '').isdigit():
                processed[key] = float(value) if '.' in value else int(value)
            else:
                processed[key] = value
        
        return processed
    
    async def _preprocess_for_transformation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess data for transformation operations."""
        # Ensure data structure is suitable for transformation
        return data
    
    async def _preprocess_for_computation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess data for computational operations."""
        # Validate numeric data
        return data
    
    async def _basic_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform basic data analysis."""
        analysis = {
            'total_fields': len(data),
            'data_types': {key: type(value).__name__ for key, value in data.items()},
            'summary': 'Basic analysis completed'
        }
        
        # Calculate basic statistics for numeric fields
        numeric_fields = {k: v for k, v in data.items() if isinstance(v, (int, float))}
        if numeric_fields:
            analysis['numeric_summary'] = {
                'count': len(numeric_fields),
                'sum': sum(numeric_fields.values()),
                'average': sum(numeric_fields.values()) / len(numeric_fields)
            }
        
        return analysis
    
    async def _statistical_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform statistical analysis."""
        # Simplified statistical analysis
        numeric_data = [v for v in data.values() if isinstance(v, (int, float))]
        
        if not numeric_data:
            return {'error': 'No numeric data found for statistical analysis'}
        
        stats = {
            'count': len(numeric_data),
            'sum': sum(numeric_data),
            'mean': sum(numeric_data) / len(numeric_data),
            'min': min(numeric_data),
            'max': max(numeric_data)
        }
        
        # Calculate variance and standard deviation
        mean = stats['mean']
        variance = sum((x - mean) ** 2 for x in numeric_data) / len(numeric_data)
        stats['variance'] = variance
        stats['std_dev'] = variance ** 0.5
        
        return {'statistical_analysis': stats}
    
    async def _trend_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform trend analysis."""
        # Simplified trend analysis
        return {
            'trend_analysis': 'Trend analysis completed',
            'data_points': len(data),
            'trend_direction': 'stable'  # Simplified
        }
    
    def _calculate_data_quality_score(self, results: Dict[str, Any]) -> float:
        """Calculate a data quality score based on processing results."""
        # Simplified quality scoring
        base_score = 0.8
        
        if 'error' in results:
            return 0.0
        
        if 'warnings' in results and results['warnings']:
            base_score -= len(results['warnings']) * 0.1
        
        return max(0.0, min(1.0, base_score))
    
    async def _format_results(self, results: Dict[str, Any], format_type: str) -> Dict[str, Any]:
        """Format results according to specified format."""
        if format_type == 'json':
            return results  # Already in JSON format
        elif format_type == 'summary':
            return {
                'summary': 'Processing completed successfully',
                'key_metrics': results.get('metadata', {}),
                'result_count': len(results.get('results', {}))
            }
        else:
            return results
    
    async def _attempt_error_recovery(self, state: Dict[str, Any]) -> bool:
        """Attempt to recover from processing errors."""
        # Simple recovery strategies
        error = state.get('error', '')
        
        if 'validation' in error.lower():
            # Try with relaxed validation
            return False  # For now, no recovery
        elif 'memory' in error.lower():
            # Try with reduced data set
            return False  # For now, no recovery
        
        return False
    
    def _update_performance_metrics(self, result: ProcessingResult):
        """Update performance metrics based on processing result."""
        self.performance_metrics['total_processed'] += 1
        
        if result.status == TaskStatus.FAILED:
            self.performance_metrics['total_failed'] += 1
        
        # Update average processing time
        current_avg = self.performance_metrics['average_processing_time']
        total_processed = self.performance_metrics['total_processed']
        
        new_avg = ((current_avg * (total_processed - 1)) + result.processing_time) / total_processed
        self.performance_metrics['average_processing_time'] = new_avg
        
        self.performance_metrics['queue_length'] = len(self.active_tasks)
    
    # Public Interface Methods
    
    async def get_task_status(self, request_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a specific task."""
        if request_id in self.active_tasks:
            task_state = self.active_tasks[request_id]
            return {
                'request_id': request_id,
                'status': 'processing',
                'current_stage': task_state.get('current_stage'),
                'stages_completed': task_state.get('stages_completed', []),
                'warnings': task_state.get('warnings', [])
            }
        elif request_id in self.completed_tasks:
            result = self.completed_tasks[request_id]
            return {
                'request_id': request_id,
                'status': result.status.value,
                'processing_time': result.processing_time,
                'stages_completed': result.stages_completed,
                'warnings': result.warnings or []
            }
        else:
            return None
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get current performance metrics."""
        return self.performance_metrics.copy()
    
    def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status."""
        return {
            'active_tasks': len(self.active_tasks),
            'queue_length': self.performance_metrics['queue_length'],
            'total_processed': self.performance_metrics['total_processed'],
            'success_rate': self._calculate_success_rate()
        }
    
    def _calculate_success_rate(self) -> float:
        """Calculate the current success rate."""
        total = self.performance_metrics['total_processed']
        failed = self.performance_metrics['total_failed']
        
        if total == 0:
            return 1.0
        
        return (total - failed) / total