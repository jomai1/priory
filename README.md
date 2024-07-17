# priory


# Data structure
- id is a UUID
- title is a string
- description is a string
- all categorical variables (urgency, benefit, effort, cost) will go from 1-5 
- sub_tasks have can be "pending", "in_progress" or "completed"
- deadline formatted as an ISO 8601 date-time string (standard value will be set.)
- time_required will go from 5 min to over 6 hours. This will be a slider that will increate time to the right non linear.
- dependencies type can be 'before', 'no_order', 'after', task_id is the UUID of another task.

{
  "id": "c0d43e1d-2dc0-4e2f-8026-78bed670305c",
  "title": "Complete Project Report",
  "description": "Finish and submit the final project report by the deadline.",
  "sub_tasks": [
  	{
      "id": "subtask1",
      "title": "Research topic",
      "status": "pending"
    },
    {
      "id": "subtask2",
      "title": "Write Title",
      "status": "pending"
    },
    {
      "id": "subtask3",
      "title": "Write Report body",
      "status": "pending"
    },
    {
      "id": "subtask4",
      "title": "Sign",
      "status": "pending"
    },
    {
      "id": "subtask5",
      "title": "Send the email to boss!",
      "status": "pending",
    }
    ],
  "deadline": "2024-07-20T23:59:00Z",
  "urgency": 3,
  "benefit": 2,
  "effort": 5,
  "cost": 2,
  "time_required": "over 6 hours",
  "categories": ["Professional", "High Priority"],
  "dependencies": [
  	{
      "task_id": "121a0c3d-5ef7-467a-837a-bea190ef1167",
      "type": "before"
    },
    {
      "task_id": "0bd022da-03cf-453f-a413-4aabbe7abb72",
      "type": "after"
  	}
  ]
}