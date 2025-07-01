from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import asyncio
import logging
from datetime import datetime
import json
from typing import Dict, Any

# Import our AI agents
from kings_court.overseer import KingAIOverseer
from serf_services.frontend_agent import SerfFrontendAgent, UserContext
from peasant_workers.backend_agent import PeasantBackendAgent, ProcessingRequest

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'ai-serfdom-secret-key'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize AI agents
king_overseer = KingAIOverseer()
serf_frontend = SerfFrontendAgent()
peasant_backend = PeasantBackendAgent()

# Store user sessions
user_sessions = {}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for load balancers."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'agents': {
            'king_overseer': 'active',
            'serf_frontend': 'active',
            'peasant_backend': 'active'
        }
    })

@app.route('/api/agents/king/strategize', methods=['POST'])
async def king_strategize():
    """Endpoint for King AI Overseer strategic planning."""
    try:
        data = request.get_json()
        objective = data.get('objective')
        context = data.get('context', {})
        
        if not objective:
            return jsonify({'error': 'Objective is required'}), 400
        
        # Execute strategic planning
        strategy = await king_overseer.strategize(objective, context)
        
        return jsonify({
            'strategy': {
                'objective': strategy.objective,
                'approach': strategy.approach,
                'resource_requirements': strategy.resource_requirements,
                'task_breakdown': strategy.task_breakdown,
                'success_metrics': strategy.success_metrics,
                'timeline': strategy.timeline,
                'risk_assessment': strategy.risk_assessment
            },
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in strategic planning: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agents/king/delegate', methods=['POST'])
async def king_delegate():
    """Endpoint for King AI Overseer task delegation."""
    try:
        data = request.get_json()
        agent_type = data.get('agent_type')
        task_description = data.get('task_description')
        priority = data.get('priority', 3)
        context = data.get('context', {})
        
        if not agent_type or not task_description:
            return jsonify({'error': 'Agent type and task description are required'}), 400
        
        # Execute task delegation
        delegation = await king_overseer.delegate_task(
            agent_type=agent_type,
            task_description=task_description,
            priority=priority,
            context=context
        )
        
        return jsonify({
            'delegation': delegation,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in task delegation: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agents/serf/interact', methods=['POST'])
async def serf_interact():
    """Endpoint for Serf Frontend Agent user interaction."""
    try:
        data = request.get_json()
        user_input = data.get('user_input')
        user_id = data.get('user_id', 'anonymous')
        session_id = data.get('session_id', f'session_{datetime.now().timestamp()}')
        
        if not user_input:
            return jsonify({'error': 'User input is required'}), 400
        
        # Get or create user context
        user_context = user_sessions.get(user_id)
        if not user_context:
            user_context = UserContext(
                user_id=user_id,
                session_id=session_id,
                history=[],
                preferences={},
                current_mood='neutral',
                interaction_count=0,
                last_interaction=''
            )
            user_sessions[user_id] = user_context
        
        # Handle the interaction
        response = await serf_frontend.handle_user_interaction(user_input, user_context)
        
        # Update session
        user_sessions[user_id] = user_context
        
        return jsonify({
            'response': {
                'message': response.message,
                'actions': response.actions,
                'requires_delegation': response.requires_delegation,
                'delegation_request': response.delegation_request,
                'requires_escalation': response.requires_escalation,
                'escalation_reason': response.escalation_reason,
                'satisfaction_prediction': response.user_satisfaction_prediction,
                'follow_up_needed': response.follow_up_needed
            },
            'user_context': {
                'interaction_count': user_context.interaction_count,
                'current_mood': user_context.current_mood
            },
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in user interaction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agents/peasant/process', methods=['POST'])
async def peasant_process():
    """Endpoint for Peasant Backend Agent data processing."""
    try:
        data = request.get_json()
        request_type = data.get('request_type')
        request_data = data.get('data', {})
        priority = data.get('priority', 3)
        requester = data.get('requester', 'api')
        metadata = data.get('metadata', {})
        
        if not request_type:
            return jsonify({'error': 'Request type is required'}), 400
        
        # Create processing request
        processing_request = ProcessingRequest(
            request_id=f"req_{datetime.now().timestamp()}",
            request_type=request_type,
            data=request_data,
            priority=priority,
            requester=requester,
            created_at=datetime.now().isoformat(),
            metadata=metadata
        )
        
        # Process the request
        result = await peasant_backend.process_request(processing_request)
        
        return jsonify({
            'result': {
                'request_id': result.request_id,
                'status': result.status.value,
                'result_data': result.result_data,
                'processing_time': result.processing_time,
                'stages_completed': result.stages_completed,
                'error_message': result.error_message,
                'warnings': result.warnings
            },
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in data processing: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/system/status', methods=['GET'])
def system_status():
    """Get overall system status."""
    try:
        # Get performance metrics from all agents
        serf_metrics = serf_frontend.get_performance_metrics()
        peasant_metrics = peasant_backend.get_performance_metrics()
        king_metrics = {
            'active_strategies': len(king_overseer.get_active_strategies()),
            'delegations_made': len(king_overseer.get_delegation_history())
        }
        
        return jsonify({
            'system_status': 'operational',
            'agents': {
                'king_overseer': {
                    'status': 'active',
                    'metrics': king_metrics
                },
                'serf_frontend': {
                    'status': 'active',
                    'metrics': serf_metrics
                },
                'peasant_backend': {
                    'status': 'active',
                    'metrics': peasant_metrics
                }
            },
            'active_sessions': len(user_sessions),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error getting system status: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/demo/customer-service', methods=['POST'])
async def demo_customer_service():
    """Demonstration of customer service scenario."""
    try:
        data = request.get_json()
        customer_inquiry = data.get('inquiry')
        
        if not customer_inquiry:
            return jsonify({'error': 'Customer inquiry is required'}), 400
        
        # Simulate customer context
        user_context = UserContext(
            user_id='demo_customer',
            session_id=f'demo_{datetime.now().timestamp()}',
            history=[],
            preferences={'communication_style': 'professional'},
            current_mood='neutral',
            interaction_count=1,
            last_interaction=''
        )
        
        # Step 1: Serf analyzes the inquiry
        serf_response = await serf_frontend.handle_user_interaction(customer_inquiry, user_context)
        
        demo_steps = [{
            'step': 1,
            'agent': 'Serf Frontend Agent',
            'action': 'Analyze customer inquiry',
            'result': {
                'message': serf_response.message,
                'requires_escalation': serf_response.requires_escalation,
                'requires_delegation': serf_response.requires_delegation
            }
        }]
        
        # Step 2: If complex, escalate to King AI Overseer
        if serf_response.requires_escalation:
            strategy = await king_overseer.strategize(
                objective=f"Resolve complex customer inquiry: {customer_inquiry}",
                context={'customer_mood': user_context.current_mood, 'inquiry_type': 'support'}
            )
            
            demo_steps.append({
                'step': 2,
                'agent': 'King AI Overseer',
                'action': 'Develop response strategy',
                'result': {
                    'strategy': strategy.approach,
                    'task_breakdown': strategy.task_breakdown
                }
            })
            
            # Step 3: Delegate to Peasant Backend if needed
            if strategy.task_breakdown:
                backend_task = strategy.task_breakdown[0]  # Use first task as example
                processing_request = ProcessingRequest(
                    request_id=f"demo_{datetime.now().timestamp()}",
                    request_type='data_analysis',
                    data={'inquiry': customer_inquiry, 'customer_context': user_context.__dict__},
                    priority=4,
                    requester='King AI Overseer',
                    created_at=datetime.now().isoformat(),
                    metadata={'task': backend_task}
                )
                
                backend_result = await peasant_backend.process_request(processing_request)
                
                demo_steps.append({
                    'step': 3,
                    'agent': 'Peasant Backend Agent',
                    'action': 'Process customer data',
                    'result': {
                        'processing_time': backend_result.processing_time,
                        'status': backend_result.status.value,
                        'stages_completed': backend_result.stages_completed
                    }
                })
        
        return jsonify({
            'demo_scenario': 'Customer Service',
            'customer_inquiry': customer_inquiry,
            'execution_steps': demo_steps,
            'final_response': serf_response.message,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in customer service demo: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/demo/business-intelligence', methods=['POST'])
async def demo_business_intelligence():
    """Demonstration of business intelligence scenario."""
    try:
        data = request.get_json()
        analysis_request = data.get('analysis_request', 'Generate quarterly business analysis')
        
        # Step 1: King AI Overseer formulates analysis strategy
        strategy = await king_overseer.strategize(
            objective=f"Business Intelligence: {analysis_request}",
            context={
                'analysis_type': 'comprehensive',
                'data_sources': ['sales', 'marketing', 'operations'],
                'timeframe': 'quarterly'
            }
        )
        
        demo_steps = [{
            'step': 1,
            'agent': 'King AI Overseer',
            'action': 'Formulate analysis strategy',
            'result': {
                'strategy': strategy.approach,
                'resource_requirements': strategy.resource_requirements,
                'task_breakdown': strategy.task_breakdown
            }
        }]
        
        # Step 2: Delegate data collection to Peasant Backend
        if strategy.task_breakdown:
            data_tasks = []
            for i, task in enumerate(strategy.task_breakdown[:2]):  # Limit to 2 tasks for demo
                processing_request = ProcessingRequest(
                    request_id=f"bi_demo_{i}_{datetime.now().timestamp()}",
                    request_type='data_analysis',
                    data={
                        'analysis_type': 'business_intelligence',
                        'data_source': task.get('description', 'business_data'),
                        'timeframe': 'quarterly'
                    },
                    priority=task.get('priority', 3),
                    requester='King AI Overseer',
                    created_at=datetime.now().isoformat(),
                    metadata={'task_description': task.get('description')}
                )
                
                result = await peasant_backend.process_request(processing_request)
                data_tasks.append({
                    'task_id': result.request_id,
                    'status': result.status.value,
                    'processing_time': result.processing_time,
                    'data_processed': len(str(result.result_data))
                })
            
            demo_steps.append({
                'step': 2,
                'agent': 'Peasant Backend Agent',
                'action': 'Collect and process business data',
                'result': {
                    'tasks_completed': len(data_tasks),
                    'tasks': data_tasks
                }
            })
        
        # Step 3: King AI Overseer analyzes synthesized data
        insights = await king_overseer.strategize(
            objective="Synthesize business intelligence insights",
            context={
                'data_collected': len(data_tasks) if 'data_tasks' in locals() else 0,
                'analysis_type': 'synthesis',
                'strategic_focus': analysis_request
            }
        )
        
        demo_steps.append({
            'step': 3,
            'agent': 'King AI Overseer',
            'action': 'Synthesize insights and recommendations',
            'result': {
                'insights': insights.approach,
                'recommendations': insights.success_metrics,
                'risk_assessment': insights.risk_assessment
            }
        })
        
        return jsonify({
            'demo_scenario': 'Business Intelligence',
            'analysis_request': analysis_request,
            'execution_steps': demo_steps,
            'final_insights': insights.approach,
            'recommendations': insights.success_metrics,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in business intelligence demo: {e}")
        return jsonify({'error': str(e)}), 500

# WebSocket events for real-time communication
@socketio.on('connect')
def on_connect():
    """Handle client connection."""
    logger.info(f"Client connected: {request.sid}")
    emit('connection_established', {
        'status': 'connected',
        'session_id': request.sid,
        'timestamp': datetime.now().isoformat()
    })

@socketio.on('disconnect')
def on_disconnect():
    """Handle client disconnection."""
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('agent_interaction')
async def handle_agent_interaction(data):
    """Handle real-time agent interactions via WebSocket."""
    try:
        agent_type = data.get('agent_type')
        message = data.get('message')
        user_id = data.get('user_id', request.sid)
        
        if agent_type == 'serf' and message:
            # Get user context
            user_context = user_sessions.get(user_id)
            if not user_context:
                user_context = UserContext(
                    user_id=user_id,
                    session_id=request.sid,
                    history=[],
                    preferences={},
                    current_mood='neutral',
                    interaction_count=0,
                    last_interaction=''
                )
                user_sessions[user_id] = user_context
            
            # Process interaction
            response = await serf_frontend.handle_user_interaction(message, user_context)
            
            # Emit response
            emit('agent_response', {
                'agent_type': 'serf',
                'response': response.message,
                'satisfaction_prediction': response.user_satisfaction_prediction,
                'requires_escalation': response.requires_escalation,
                'timestamp': datetime.now().isoformat()
            })
    
    except Exception as e:
        logger.error(f"Error in WebSocket interaction: {e}")
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    # Run the Flask app with SocketIO
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)