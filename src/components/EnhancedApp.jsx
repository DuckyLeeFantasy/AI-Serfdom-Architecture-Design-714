import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Crown, Users, Server, Activity, MessageSquare, Plus, Zap, Shield, Database } from 'lucide-react';
import { aiSerfdomAPI } from '../services/aiSerfdomAPI';
import { useSupabaseData } from '../hooks/useSupabaseData';

function EnhancedApp() {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Use our existing Supabase hook for real-time data
  const { 
    agents: liveAgents, 
    metrics, 
    decisions, 
    tasks: liveTasks,
    logUserInteraction 
  } = useSupabaseData();

  useEffect(() => {
    fetchData();
    
    // Log page view
    logUserInteraction({
      interaction_type: 'page_view',
      page_path: '/ai-serfdom-app',
      data: { component: 'EnhancedApp' }
    });
  }, [logUserInteraction]);

  // Update local state when live data changes
  useEffect(() => {
    if (liveAgents.length > 0) {
      const formattedAgents = liveAgents.map(agent => ({
        id: agent.id,
        name: agent.name,
        type: agent.role,
        status: agent.status,
        capabilities: agent.capabilities || [],
        metrics: agent.metrics || {}
      }));
      setAgents(formattedAgents);
    }
  }, [liveAgents]);

  useEffect(() => {
    if (liveTasks.length > 0) {
      const formattedTasks = liveTasks.map(task => ({
        id: task.id,
        description: task.description,
        status: task.status,
        priority: task.priority,
        steps: task.execution_steps || [],
        result: task.result || task.outcome,
        createdAt: task.created_at,
        assignedBy: task.assigned_by_agent,
        assignedTo: task.assigned_to_agent
      }));
      setTasks(formattedTasks);
    }
  }, [liveTasks]);

  const fetchData = async () => {
    try {
      const [agentsRes, tasksRes, statsRes] = await Promise.all([
        aiSerfdomAPI.getAgents(),
        aiSerfdomAPI.getTasks(),
        aiSerfdomAPI.getSystemStats()
      ]);

      if (agentsRes.success) setAgents(agentsRes.agents);
      if (tasksRes.success) setTasks(tasksRes.tasks);
      if (statsRes.success) setSystemStats(statsRes.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createTask = async () => {
    if (!newTaskDescription.trim()) return;

    setLoading(true);
    try {
      const response = await aiSerfdomAPI.createTask({
        description: newTaskDescription,
        priority: newTaskPriority
      });

      if (response.success) {
        setNewTaskDescription('');
        setNewTaskPriority('medium');
        
        // Log user interaction
        await logUserInteraction({
          interaction_type: 'task_creation',
          data: {
            description: newTaskDescription,
            priority: newTaskPriority
          }
        });
        
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await aiSerfdomAPI.executeTask(taskId);
      
      if (response.success) {
        await logUserInteraction({
          interaction_type: 'task_execution',
          data: { task_id: taskId }
        });
        
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error executing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgentIcon = (type) => {
    switch (type) {
      case 'king':
      case 'overseer': 
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 'serf':
      case 'frontend': 
        return <Users className="h-6 w-6 text-emerald-500" />;
      case 'peasant':
      case 'backend': 
        return <Server className="h-6 w-6 text-blue-500" />;
      default: 
        return <Activity className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-emerald-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 5:
      case 'critical': return 'bg-red-500';
      case 4:
      case 'high': return 'bg-orange-500';
      case 3:
      case 'medium': return 'bg-yellow-500';
      case 2:
      case 1:
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Crown className="h-10 w-10 text-gold-400" />
            AI-Serfdom System
          </h1>
          <p className="text-royal-300 text-lg">
            Hierarchical Multi-Agent AI Architecture with Supabase Integration
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-royal-800/50 backdrop-blur-sm rounded-lg p-1 flex gap-1 border border-royal-600">
            {['dashboard', 'agents', 'tasks', 'metrics'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? 'bg-gold-500 text-royal-900' : 'text-royal-300 hover:text-white'}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">Online</div>
                <p className="text-royal-400">All agents operational</p>
              </CardContent>
            </Card>

            <Card className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Active Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{agents.length}</div>
                <p className="text-royal-400">Agents in hierarchy</p>
              </CardContent>
            </Card>

            <Card className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{tasks.length}</div>
                <p className="text-royal-400">Tasks processed</p>
              </CardContent>
            </Card>

            <Card className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-gold-500" />
                  Live Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gold-400">{metrics.length}</div>
                <p className="text-royal-400">Real-time data points</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    {getAgentIcon(agent.type)}
                    {agent.name}
                  </CardTitle>
                  <CardDescription className="text-royal-400">
                    {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <span className="text-royal-300 capitalize">{agent.status}</span>
                    </div>
                    {agent.capabilities.length > 0 && (
                      <div>
                        <p className="text-sm text-royal-400 mb-2">Capabilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.map((capability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-royal-600 text-royal-200">
                              {capability.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Create New Task */}
            <Card className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe the task you want the AI-Serfdom system to handle..."
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="bg-royal-700 border-royal-600 text-white placeholder:text-royal-400"
                  />
                  <div className="flex gap-4">
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="bg-royal-700 border border-royal-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical Priority</option>
                    </select>
                    <Button 
                      onClick={createTask} 
                      disabled={loading || !newTaskDescription.trim()}
                      className="flex-1 bg-gold-500 hover:bg-gold-600 text-royal-900"
                    >
                      {loading ? 'Creating...' : 'Create Task'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">
                          Task #{task.id.toString().slice(0, 8)}
                        </CardTitle>
                        <CardDescription className="text-royal-400">
                          {task.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                          Priority: {task.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(task.status)} text-white`}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {task.steps && task.steps.length > 0 && (
                        <div>
                          <p className="text-sm text-royal-400 mb-2">Execution Steps:</p>
                          <div className="space-y-2">
                            {task.steps.map((step, index) => (
                              <div key={index} className="bg-royal-700/50 p-3 rounded text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  {getAgentIcon(step.agent === 'king_overseer' ? 'overseer' : 
                                              step.agent === 'serf_frontend' ? 'frontend' : 'backend')}
                                  <span className="text-white font-medium">
                                    {step.agent.replace('_', ' ').toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-royal-300">{step.action}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {task.status === 'pending' && (
                        <Button 
                          onClick={() => executeTask(task.id)}
                          disabled={loading}
                          className="w-full bg-emerald-500 hover:bg-emerald-600"
                        >
                          {loading ? 'Executing...' : 'Execute Task'}
                        </Button>
                      )}
                      
                      {task.result && (
                        <div className="bg-emerald-900/20 border border-emerald-700 p-3 rounded">
                          <p className="text-emerald-300 text-sm">
                            <strong>Result:</strong> {task.result}
                          </p>
                        </div>
                      )}

                      {task.assignedTo && (
                        <div className="flex items-center gap-2 text-sm text-royal-400">
                          <span>Assigned to:</span>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {task.assignedTo.name}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <Card className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gold-500" />
                  Recent Decisions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {decisions.slice(0, 5).map((decision) => (
                    <div key={decision.id} className="bg-royal-700/30 p-3 rounded border border-royal-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{decision.description}</span>
                        <Badge className="bg-gold-500/20 text-gold-400">
                          {decision.confidence_score}% confidence
                        </Badge>
                      </div>
                      <p className="text-royal-300 text-sm">{decision.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-royal-800/50 backdrop-blur-sm border-royal-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics.slice(0, 9).map((metric) => (
                    <div key={metric.id} className="bg-royal-700/30 p-3 rounded border border-royal-600">
                      <div className="text-sm text-royal-400">{metric.metric_type.replace('_', ' ')}</div>
                      <div className="text-lg font-bold text-white">
                        {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}
                        {metric.unit && <span className="text-sm text-royal-400 ml-1">{metric.unit}</span>}
                      </div>
                      <div className="text-xs text-royal-500">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedApp;