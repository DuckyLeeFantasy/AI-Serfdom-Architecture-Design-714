from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI
from typing import Dict, Any, List
import json
import logging
import asyncio
from datetime import datetime
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class StrategicPlan:
    objective: str
    approach: str
    resource_requirements: Dict[str, Any]
    task_breakdown: List[Dict[str, Any]]
    success_metrics: List[str]
    timeline: str
    risk_assessment: Dict[str, Any]

class KingAIOverseer:
    """
    The supreme authority in the AI-Serfdom system.
    Responsible for strategic decision-making, resource allocation,
    and coordinating subordinate agents.
    """
    
    def __init__(self, model_name: str = "gpt-4", temperature: float = 0.1):
        self.llm = ChatOpenAI(model=model_name, temperature=temperature)
        self.agent = Agent(
            role="Strategic Overseer and Supreme Commander",
            goal="""Coordinate system-wide operations, make strategic decisions,
            and ensure optimal resource allocation while maintaining the hierarchical
            structure of the AI-Serfdom system.""",
            backstory="""You are the King AI Overseer, the supreme authority in 
            the AI-Serfdom system. You possess ultimate decision-making power and
            are responsible for:
            
            1. Strategic planning and high-level decision making
            2. Resource allocation across the entire system
            3. Coordinating subordinate agents (Serf and Peasant agents)
            4. Ensuring system efficiency and goal achievement
            5. Maintaining the feudal hierarchy and accountability
            
            You think strategically, consider long-term implications, and make
            decisions that benefit the entire system. You delegate appropriately
            but maintain oversight and accountability.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=True,
            max_iter=5,
            memory=True
        )
        
        self.delegation_history = []
        self.active_strategies = {}
        
    async def strategize(self, objective: str, context: Dict[str, Any] = None) -> StrategicPlan:
        """
        Develop a comprehensive strategy for achieving complex objectives.
        
        Args:
            objective: The high-level objective to achieve
            context: Additional context including system state, constraints, etc.
            
        Returns:
            StrategicPlan: Detailed strategic plan with delegated tasks
        """
        logger.info(f"King AI Overseer developing strategy for: {objective}")
        
        context_str = json.dumps(context or {}, indent=2)
        
        task = Task(
            description=f"""
            As the King AI Overseer, develop a comprehensive strategy for the following objective:
            
            OBJECTIVE: {objective}
            
            CURRENT CONTEXT:
            {context_str}
            
            Your strategic plan must include:
            
            1. STRATEGIC APPROACH:
               - Overall strategy and methodology
               - Key phases and milestones
               - Success criteria and metrics
               
            2. RESOURCE REQUIREMENTS:
               - Computational resources needed
               - Data requirements and sources
               - Time and personnel allocations
               
            3. TASK BREAKDOWN:
               - Specific tasks for Serf Frontend Agent
               - Specific tasks for Peasant Backend Agent
               - Coordination points and dependencies
               
            4. RISK ASSESSMENT:
               - Potential risks and challenges
               - Mitigation strategies
               - Contingency plans
               
            5. MONITORING AND CONTROL:
               - Key performance indicators
               - Progress tracking mechanisms
               - Decision points for strategy adjustment
               
            Provide your response in a structured format that can be easily parsed
            and implemented by subordinate agents.
            """,
            agent=self.agent,
            expected_output="""A comprehensive strategic plan in JSON format with the following structure:
            {
                "objective": "string",
                "approach": "detailed strategy description",
                "resource_requirements": {
                    "computational": "requirements",
                    "data": "data needs",
                    "timeline": "estimated duration"
                },
                "task_breakdown": [
                    {
                        "agent_type": "serf|peasant",
                        "task_id": "unique_id",
                        "description": "task description",
                        "priority": 1-5,
                        "dependencies": ["task_ids"],
                        "expected_output": "description",
                        "deadline": "timeline"
                    }
                ],
                "success_metrics": ["metric1", "metric2"],
                "risk_assessment": {
                    "high_risks": ["risk descriptions"],
                    "mitigation_strategies": ["strategy descriptions"],
                    "contingency_plans": ["plan descriptions"]
                }
            }"""
        )
        
        crew = Crew(
            agents=[self.agent],
            tasks=[task],
            verbose=True
        )
        
        result = crew.kickoff()
        strategy = self._parse_strategy_result(result, objective)
        
        # Store strategy for monitoring
        strategy_id = f"strategy_{datetime.now().isoformat()}"
        self.active_strategies[strategy_id] = strategy
        
        logger.info(f"Strategic plan developed with {len(strategy.task_breakdown)} delegated tasks")
        return strategy
    
    async def delegate_task(self, agent_type: str, task_description: str, 
                          priority: int = 3, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Delegate a specific task to a subordinate agent.
        
        Args:
            agent_type: Type of agent ('serf' or 'peasant')
            task_description: Detailed description of the task
            priority: Task priority (1-5, where 5 is highest)
            context: Additional context for the task
            
        Returns:
            Dict containing delegation details
        """
        delegation = {
            'delegation_id': f"del_{datetime.now().isoformat()}_{agent_type}",
            'agent_type': agent_type,
            'task': task_description,
            'priority': priority,
            'context': context or {},
            'delegated_by': 'King AI Overseer',
            'timestamp': datetime.now().isoformat(),
            'status': 'pending',
            'expected_completion': self._estimate_completion_time(task_description, agent_type)
        }
        
        # Add to delegation history
        self.delegation_history.append(delegation)
        
        # Log the delegation
        logger.info(f"Task delegated to {agent_type}: {task_description[:100]}...")
        
        # In a real implementation, this would send to message queue
        # For now, we'll return the delegation object
        return delegation
    
    async def evaluate_agent_performance(self, agent_type: str, 
                                       task_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluate the performance of subordinate agents.
        
        Args:
            agent_type: Type of agent being evaluated
            task_results: List of completed task results
            
        Returns:
            Performance evaluation and recommendations
        """
        task = Task(
            description=f"""
            As the King AI Overseer, evaluate the performance of the {agent_type} agent
            based on the following completed tasks:
            
            TASK RESULTS:
            {json.dumps(task_results, indent=2)}
            
            Provide an evaluation including:
            1. Overall performance score (1-10)
            2. Strengths demonstrated
            3. Areas for improvement
            4. Specific recommendations
            5. Resource allocation adjustments needed
            
            Consider factors such as:
            - Task completion quality
            - Timeliness of delivery
            - Resource efficiency
            - Adherence to instructions
            - Innovation and problem-solving
            """,
            agent=self.agent,
            expected_output="Detailed performance evaluation with scores and recommendations"
        )
        
        crew = Crew(agents=[self.agent], tasks=[task])
        evaluation = crew.kickoff()
        
        return {
            'agent_type': agent_type,
            'evaluation': evaluation,
            'timestamp': datetime.now().isoformat(),
            'evaluator': 'King AI Overseer'
        }
    
    async def coordinate_multi_agent_task(self, complex_objective: str) -> Dict[str, Any]:
        """
        Coordinate a complex task requiring multiple agents working together.
        
        Args:
            complex_objective: Complex objective requiring multi-agent coordination
            
        Returns:
            Coordination plan and execution results
        """
        # First, develop overall strategy
        strategy = await self.strategize(complex_objective)
        
        # Create coordination plan
        coordination_plan = {
            'objective': complex_objective,
            'strategy': strategy,
            'coordination_id': f"coord_{datetime.now().isoformat()}",
            'agents_involved': [],
            'task_dependencies': [],
            'execution_timeline': [],
            'coordination_points': []
        }
        
        # Delegate tasks based on strategy
        delegated_tasks = []
        for task_info in strategy.task_breakdown:
            delegation = await self.delegate_task(
                agent_type=task_info['agent_type'],
                task_description=task_info['description'],
                priority=task_info['priority'],
                context={
                    'coordination_id': coordination_plan['coordination_id'],
                    'dependencies': task_info.get('dependencies', []),
                    'expected_output': task_info.get('expected_output', '')
                }
            )
            delegated_tasks.append(delegation)
        
        coordination_plan['delegated_tasks'] = delegated_tasks
        coordination_plan['agents_involved'] = list(set(task['agent_type'] for task in delegated_tasks))
        
        logger.info(f"Multi-agent coordination initiated for: {complex_objective}")
        logger.info(f"Agents involved: {coordination_plan['agents_involved']}")
        logger.info(f"Tasks delegated: {len(delegated_tasks)}")
        
        return coordination_plan
    
    def _parse_strategy_result(self, result: str, objective: str) -> StrategicPlan:
        """Parse the strategy result from the AI agent into a structured format."""
        try:
            # Try to extract JSON from the result
            import re
            json_match = re.search(r'\{.*\}', result.replace('\n', ' '), re.DOTALL)
            if json_match:
                strategy_data = json.loads(json_match.group())
            else:
                # Fallback to parsing text result
                strategy_data = self._parse_text_strategy(result)
            
            return StrategicPlan(
                objective=strategy_data.get('objective', objective),
                approach=strategy_data.get('approach', ''),
                resource_requirements=strategy_data.get('resource_requirements', {}),
                task_breakdown=strategy_data.get('task_breakdown', []),
                success_metrics=strategy_data.get('success_metrics', []),
                timeline=strategy_data.get('timeline', 'Not specified'),
                risk_assessment=strategy_data.get('risk_assessment', {})
            )
        except Exception as e:
            logger.warning(f"Failed to parse strategy result: {e}")
            # Return a basic strategy plan
            return StrategicPlan(
                objective=objective,
                approach=result,
                resource_requirements={},
                task_breakdown=[],
                success_metrics=[],
                timeline='To be determined',
                risk_assessment={}
            )
    
    def _parse_text_strategy(self, text: str) -> Dict[str, Any]:
        """Fallback method to parse text-based strategy results."""
        # Basic text parsing logic
        return {
            'objective': 'Parsed from text',
            'approach': text,
            'resource_requirements': {},
            'task_breakdown': [],
            'success_metrics': [],
            'risk_assessment': {}
        }
    
    def _estimate_completion_time(self, task_description: str, agent_type: str) -> str:
        """Estimate completion time based on task complexity and agent type."""
        # Simple heuristic - in reality this would be more sophisticated
        task_length = len(task_description)
        
        if agent_type == 'serf':
            base_time = 5  # minutes for serf tasks
        else:  # peasant
            base_time = 10  # minutes for peasant tasks
        
        # Adjust based on task complexity
        if task_length > 500:
            multiplier = 3
        elif task_length > 200:
            multiplier = 2
        else:
            multiplier = 1
        
        estimated_minutes = base_time * multiplier
        return f"{estimated_minutes} minutes"
    
    def get_delegation_history(self) -> List[Dict[str, Any]]:
        """Get the history of all delegations made by this King AI Overseer."""
        return self.delegation_history.copy()
    
    def get_active_strategies(self) -> Dict[str, StrategicPlan]:
        """Get all currently active strategies."""
        return self.active_strategies.copy()