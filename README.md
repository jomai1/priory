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


Example
```JSON
{
        "id": "b8d05cfa-da80-4a58-bd5b-10916b73158c",
        "title": "Something else....",
        "description": "Finish and submit the final project report by the deadline.",
        "sub_tasks": [
            {
                "title": "Research topic",
                "status": "pending",
                "id": "3e4ded4d-a53f-4682-9098-3b8711a06267"
            },
            {
                "title": "Write Title",
                "status": "pending",
                "id": "355ea140-5e63-407c-bb83-956aeaf634ff"
            },
            {
                "title": "Write Report body",
                "status": "pending",
                "id": "90db5d5c-581b-4410-ab3a-b34dd8af3a47"
            }
        ],
        "deadline": "2024-07-20T23:59:00Z",
        "urgency": 3,
        "benefit": 2,
        "effort": 5,
        "cost": 2,
        "time_required": 603,
        "categories": [
            "Professional",
            "High Priority"
        ],
        "dependencies": [
            {
                "task_id": "121a0c3d-5ef7-467a-837a-bea190ef1167",
                "type": "before"
            },
            {
                "task_id": "0bd022da-03cf-453f-a413-4aabbe7abb72",
                "type": "after"
            },
            {
                "task_id": "0bd022da-33cf-453f-a413-4aabbe7abb72",
                "type": "no_order"
            }
        ]
    }
```