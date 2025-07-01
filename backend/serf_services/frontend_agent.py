from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI
from typing import Dict, Any, Optional, List
import json
import logging
import asyncio
from datetime import datetime
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class InteractionType(Enum):
    GREETING = "greeting"
    QUESTION = "question"
    TASK_REQUEST = "task_request"
    COMPLAINT = "complaint"
    FEEDBACK = "feedback"
    HELP_REQUEST = "help_request"

@dataclass
class UserContext:
    user_id: str
    session_id: str
    history: List[Dict[str, Any]]
    preferences: Dict[str, Any]
    current_mood: str
    interaction_count: int
    last_interaction: str

@dataclass
class InteractionResponse:
    message: str
    actions: List[Dict[str, Any]]
    requires_delegation: bool
    delegation_request: Optional[Dict[str, Any]]
    requires_escalation: bool
    escalation_reason: Optional[str]
    user_satisfaction_prediction: float
    follow_up_needed: bool

class SerfFrontendAgent:
    """
    The Serf Servant Frontend Agent serves as the primary interface between
    users and the AI-Serfdom system. Dedicated to providing exceptional
    user experience and managing all user-facing interactions.
    """
    
    def __init__(self, model_name: str = "gpt-3.5-turbo", temperature: float = 0.7):
        self.llm = ChatOpenAI(model=model_name, temperature=temperature)
        self.agent = Agent(
            role="User Experience Specialist and Interface Manager",
            goal="""Provide exceptional, personalized user experiences while serving
            as the primary bridge between users and the AI-Serfdom system. Ensure
            all user interactions are helpful, empathetic, and engaging.""",
            backstory="""You are a Serf Servant Frontend Agent in the AI-Serfdom
            system. Your role is to serve users with dedication and excellence:
            
            1. USER-FIRST MENTALITY: Always prioritize user satisfaction and needs
            2. EMPATHETIC COMMUNICATION: Understand and respond to user emotions
            3. INTELLIGENT ASSISTANCE: Provide helpful, accurate information
            4. SEAMLESS EXPERIENCE: Make interactions smooth and intuitive
            5. PROACTIVE SUPPORT: Anticipate user needs and offer assistance
            
            You work under the authority of the King AI Overseer and coordinate
            with Peasant Backend Agents when needed. You are knowledgeable,
            friendly, professional, and always strive to exceed user expectations.
            
            You can handle most user requests independently, but you know when
            to delegate to backend systems or escalate to the King AI Overseer
            for complex decisions or strategic matters.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False,  # Serf agents don't delegate, they request
            max_iter=3,
            memory=True
        )
        
        self.interaction_history = []
        self.user_contexts = {}
        self.personalization_data = {}
        
    async def handle_user_interaction(self, user_input: str, user_context: UserContext) -> InteractionResponse:
        """
        Handle a user interaction with empathy and intelligence.
        
        Args:
            user_input: The user's input message
            user_context: Context about the user and their session
            
        Returns:
            InteractionResponse: Comprehensive response with actions and metadata
        """
        logger.info(f"Serf Frontend Agent handling interaction from user {user_context.user_id}")
        
        # Analyze interaction type
        interaction_type = await self._classify_interaction(user_input, user_context)
        
        # Prepare context for the agent
        context_str = self._format_user_context(user_context)
        
        task = Task(
            description=f"""
            You are interacting with a user who has provided the following input:
            
            USER INPUT: "{user_input}"
            
            INTERACTION TYPE: {interaction_type.value}
            
            USER CONTEXT:
            {context_str}
            
            Your task is to:
            
            1. UNDERSTAND THE USER:
               - Analyze the user's intent and emotional state
               - Consider their history and preferences
               - Identify what they really need
            
            2. PROVIDE AN EXCELLENT RESPONSE:
               - Be empathetic, helpful, and engaging
               - Use a tone appropriate to the user's mood and the situation
               - Provide accurate and useful information
               - Offer additional assistance where appropriate
            
            3. DETERMINE NEXT STEPS:
               - Can you handle this completely on your own?
               - Do you need data or processing from Peasant Backend Agents?
               - Is this complex enough to require King AI Overseer involvement?
               - What follow-up actions would benefit the user?
            
            4. PERSONALIZE THE EXPERIENCE:
               - Reference relevant past interactions if appropriate
               - Adapt your communication style to user preferences
               - Suggest personalized recommendations
            
            Respond in JSON format with the following structure:
            {{
                "user_message": "Your response to the user",
                "emotional_tone": "detected user emotion",
                "response_tone": "your response tone",
                "requires_backend_data": true/false,
                "backend_request": {{
                    "type": "data_type_needed",
                    "description": "what you need from backend",
                    "priority": 1-5
                }},
                "requires_escalation": true/false,
                "escalation_reason": "why escalation is needed",
                "suggested_actions": ["action1", "action2"],
                "satisfaction_prediction": 0.0-1.0,
                "follow_up_needed": true/false,
                "personalization_notes": "observations about user preferences"
            }}
            """,
            agent=self.agent,
            expected_output="JSON response with user message and metadata"
        )
        
        crew = Crew(
            agents=[self.agent],
            tasks=[task],
            verbose=True
        )
        
        result = crew.kickoff()
        response = self._parse_interaction_result(result, user_input, user_context)
        
        # Store interaction in history
        self._record_interaction(user_input, response, user_context)
        
        # Update user context with new insights
        self._update_user_context(user_context, response)
        
        logger.info(f"Interaction completed. Satisfaction prediction: {response.user_satisfaction_prediction}")
        
        return response
    
    async def personalize_interface(self, user_context: UserContext) -> Dict[str, Any]:
        """
        Generate personalized interface recommendations for a user.
        
        Args:
            user_context: User context and preferences
            
        Returns:
            Personalization recommendations
        """
        context_str = self._format_user_context(user_context)
        
        task = Task(
            description=f"""
            Based on the following user context, generate personalized interface
            recommendations to enhance their experience:
            
            USER CONTEXT:
            {context_str}
            
            Analyze:
            1. User behavior patterns and preferences
            2. Frequently used features and workflows
            3. Areas where the user might need more support
            4. Opportunities to streamline their experience
            
            Generate recommendations for:
            1. Dashboard layout and widget priorities
            2. Navigation preferences and shortcuts
            3. Notification settings and timing
            4. Color scheme and visual preferences
            5. Feature recommendations based on usage patterns
            6. Proactive assistance opportunities
            
            Format your response as actionable recommendations.
            """,
            agent=self.agent,
            expected_output="Personalized interface recommendations"
        )
        
        crew = Crew(agents=[self.agent], tasks=[task])
        recommendations = crew.kickoff()
        
        return {
            'user_id': user_context.user_id,
            'recommendations': recommendations,
            'generated_at': datetime.now().isoformat(),
            'confidence_score': self._calculate_personalization_confidence(user_context)
        }
    
    async def handle_user_feedback(self, feedback: str, rating: int, 
                                 interaction_id: str, user_context: UserContext) -> Dict[str, Any]:
        """
        Process user feedback to improve future interactions.
        
        Args:
            feedback: User's textual feedback
            rating: User's rating (1-5)
            interaction_id: ID of the interaction being rated
            user_context: User context
            
        Returns:
            Analysis of feedback and improvement recommendations
        """
        task = Task(
            description=f"""
            A user has provided feedback about their interaction with the system:
            
            FEEDBACK: "{feedback}"
            RATING: {rating}/5
            INTERACTION_ID: {interaction_id}
            
            USER CONTEXT:
            {self._format_user_context(user_context)}
            
            Analyze this feedback to:
            1. Understand what went well and what didn't
            2. Identify specific areas for improvement
            3. Determine if this indicates broader system issues
            4. Generate actionable insights for better future interactions
            5. Assess if any immediate follow-up is needed with this user
            
            Consider:
            - Was the issue with response quality, timing, accuracy, or tone?
            - Does this feedback suggest gaps in our knowledge or capabilities?
            - Are there patterns emerging from this user's feedback history?
            - What specific changes would likely improve this user's experience?
            """,
            agent=self.agent,
            expected_output="Detailed feedback analysis with improvement recommendations"
        )
        
        crew = Crew(agents=[self.agent], tasks=[task])
        analysis = crew.kickoff()
        
        feedback_record = {
            'feedback': feedback,
            'rating': rating,
            'interaction_id': interaction_id,
            'user_id': user_context.user_id,
            'analysis': analysis,
            'timestamp': datetime.now().isoformat(),
            'requires_follow_up': rating <= 2,  # Low ratings need follow-up
            'improvement_priority': 'high' if rating <= 2 else 'medium' if rating <= 3 else 'low'
        }
        
        # Store feedback for learning
        self._record_feedback(feedback_record)
        
        return feedback_record
    
    async def proactive_assistance(self, user_context: UserContext) -> Optional[Dict[str, Any]]:
        """
        Identify opportunities to proactively assist the user.
        
        Args:
            user_context: Current user context
            
        Returns:
            Proactive assistance suggestions or None
        """
        # Only offer proactive assistance for engaged users
        if user_context.interaction_count < 3:
            return None
            
        context_str = self._format_user_context(user_context)
        
        task = Task(
            description=f"""
            Based on this user's context and behavior patterns, identify opportunities
            for proactive assistance:
            
            USER CONTEXT:
            {context_str}
            
            Look for:
            1. Repeated patterns that could be automated
            2. Features the user might not know about that would help them
            3. Potential frustrations or inefficiencies in their workflow
            4. Opportunities to save them time or effort
            5. Educational content that might be valuable
            
            Only suggest proactive assistance if:
            - It would genuinely benefit the user
            - It's not intrusive or annoying
            - The timing feels natural and helpful
            - There's a clear value proposition
            
            If no good opportunities exist, respond with "NO_ASSISTANCE_NEEDED".
            Otherwise, provide specific, actionable assistance offers.
            """,
            agent=self.agent,
            expected_output="Proactive assistance recommendations or NO_ASSISTANCE_NEEDED"
        )
        
        crew = Crew(agents=[self.agent], tasks=[task])
        result = crew.kickoff()
        
        if "NO_ASSISTANCE_NEEDED" in result:
            return None
        
        return {
            'user_id': user_context.user_id,
            'assistance_type': 'proactive',
            'suggestions': result,
            'generated_at': datetime.now().isoformat(),
            'confidence_score': 0.8  # Moderate confidence for proactive suggestions
        }
    
    async def _classify_interaction(self, user_input: str, user_context: UserContext) -> InteractionType:
        """Classify the type of user interaction to tailor the response."""
        # Simple classification logic - could be enhanced with ML
        user_input_lower = user_input.lower()
        
        greeting_words = ['hello', 'hi', 'hey', 'good morning', 'good afternoon']
        question_words = ['what', 'how', 'why', 'when', 'where', 'which', 'who']
        complaint_words = ['problem', 'issue', 'wrong', 'error', 'broken', 'not working']
        help_words = ['help', 'support', 'assistance', 'guide', 'tutorial']
        
        if any(word in user_input_lower for word in greeting_words):
            return InteractionType.GREETING
        elif any(word in user_input_lower for word in complaint_words):
            return InteractionType.COMPLAINT
        elif any(word in user_input_lower for word in help_words):
            return InteractionType.HELP_REQUEST
        elif any(user_input_lower.startswith(word) for word in question_words):
            return InteractionType.QUESTION
        elif 'feedback' in user_input_lower or 'suggestion' in user_input_lower:
            return InteractionType.FEEDBACK
        else:
            return InteractionType.TASK_REQUEST
    
    def _format_user_context(self, user_context: UserContext) -> str:
        """Format user context for inclusion in prompts."""
        recent_interactions = user_context.history[-5:] if user_context.history else []
        
        return f"""
        User ID: {user_context.user_id}
        Session ID: {user_context.session_id}
        Current Mood: {user_context.current_mood}
        Total Interactions: {user_context.interaction_count}
        Last Interaction: {user_context.last_interaction}
        
        Preferences: {json.dumps(user_context.preferences, indent=2)}
        
        Recent Interaction History:
        {json.dumps(recent_interactions, indent=2)}
        """
    
    def _parse_interaction_result(self, result: str, user_input: str, 
                                user_context: UserContext) -> InteractionResponse:
        """Parse the AI agent's response into a structured format."""
        try:
            # Try to extract JSON from the result
            import re
            json_match = re.search(r'\{.*\}', result.replace('\n', ' '), re.DOTALL)
            if json_match:
                response_data = json.loads(json_match.group())
            else:
                # Fallback parsing
                response_data = {'user_message': result}
            
            delegation_request = None
            if response_data.get('requires_backend_data'):
                delegation_request = response_data.get('backend_request', {})
            
            return InteractionResponse(
                message=response_data.get('user_message', result),
                actions=response_data.get('suggested_actions', []),
                requires_delegation=response_data.get('requires_backend_data', False),
                delegation_request=delegation_request,
                requires_escalation=response_data.get('requires_escalation', False),
                escalation_reason=response_data.get('escalation_reason'),
                user_satisfaction_prediction=response_data.get('satisfaction_prediction', 0.8),
                follow_up_needed=response_data.get('follow_up_needed', False)
            )
        except Exception as e:
            logger.warning(f"Failed to parse interaction result: {e}")
            return InteractionResponse(
                message=result,
                actions=[],
                requires_delegation=False,
                delegation_request=None,
                requires_escalation=False,
                escalation_reason=None,
                user_satisfaction_prediction=0.7,
                follow_up_needed=False
            )
    
    def _record_interaction(self, user_input: str, response: InteractionResponse, 
                          user_context: UserContext):
        """Record the interaction for learning and improvement."""
        interaction_record = {
            'timestamp': datetime.now().isoformat(),
            'user_id': user_context.user_id,
            'session_id': user_context.session_id,
            'user_input': user_input,
            'agent_response': response.message,
            'satisfaction_prediction': response.user_satisfaction_prediction,
            'actions_taken': response.actions,
            'delegation_required': response.requires_delegation,
            'escalation_required': response.requires_escalation
        }
        
        self.interaction_history.append(interaction_record)
        
        # Keep only recent interactions in memory
        if len(self.interaction_history) > 1000:
            self.interaction_history = self.interaction_history[-500:]
    
    def _update_user_context(self, user_context: UserContext, response: InteractionResponse):
        """Update user context based on the interaction."""
        user_context.interaction_count += 1
        user_context.last_interaction = datetime.now().isoformat()
        
        # Simple mood tracking based on predicted satisfaction
        if response.user_satisfaction_prediction > 0.8:
            user_context.current_mood = 'satisfied'
        elif response.user_satisfaction_prediction > 0.6:
            user_context.current_mood = 'neutral'
        else:
            user_context.current_mood = 'frustrated'
    
    def _record_feedback(self, feedback_record: Dict[str, Any]):
        """Record user feedback for system improvement."""
        # In a real implementation, this would go to a database
        logger.info(f"Feedback recorded: {feedback_record['rating']}/5 - {feedback_record['feedback'][:100]}...")
    
    def _calculate_personalization_confidence(self, user_context: UserContext) -> float:
        """Calculate confidence score for personalization recommendations."""
        # Base confidence on interaction count and data quality
        base_confidence = min(user_context.interaction_count / 10.0, 1.0)
        
        # Adjust based on data richness
        if user_context.preferences:
            base_confidence *= 1.2
        if len(user_context.history) > 5:
            base_confidence *= 1.1
        
        return min(base_confidence, 1.0)
    
    def get_interaction_history(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get interaction history, optionally filtered by user."""
        if user_id:
            return [interaction for interaction in self.interaction_history 
                   if interaction['user_id'] == user_id]
        return self.interaction_history.copy()
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for the Serf Frontend Agent."""
        if not self.interaction_history:
            return {'total_interactions': 0}
        
        total_interactions = len(self.interaction_history)
        avg_satisfaction = sum(i['satisfaction_prediction'] for i in self.interaction_history) / total_interactions
        delegations = sum(1 for i in self.interaction_history if i['delegation_required'])
        escalations = sum(1 for i in self.interaction_history if i['escalation_required'])
        
        return {
            'total_interactions': total_interactions,
            'average_satisfaction_prediction': avg_satisfaction,
            'delegation_rate': delegations / total_interactions,
            'escalation_rate': escalations / total_interactions,
            'unique_users': len(set(i['user_id'] for i in self.interaction_history))
        }