Objective Requirements
Create an Angular application that consumes a REST API providing information about tasks and
associated times.
Create the following components to visualize task and time information:
Task List: The component should display the following information for each task in list
and/or card format:
Name
Description
Client
Time spent (accumulated hours dedicated to this task).
Task Form: Task entry form (modification not mandatory) allowing users to add new tasks.
The form should have the following fields:
Name (Required)
Client (Required)
Description (Optional)
Time List: It's necessary to be able to see the times associated with a task. You can choose
between two options:
From the task editor: In the same task editor, add the list of related times. New times
should be able to be added.
An independent list: Create a separate list showing time entries grouped by task. New
times should be able to be added by selecting the task they belong to.
Bonus
Create a component to simulate a task timer.
New times should be able to be started from the task list.
When starting a time, register the time (make a POST call to times) with an empty end date.
At all times, the application should display the current time and the task it's associated with (thus,
there can only be one current time).
When starting a new time, the current time should be updated (make a PUT call changing
Considerations:
/tasks
GET
Responses
Code Description Schema
200 Tasks fetched successfully Task GET method response model
204 No tasks found
POST
Parameters
Name Located in Description Required Schema
X-ACCESS-TOKEN header Access token Yes string
payload body Yes Task POST request model
Responses
Code Description Schema
201 Task created successfully Task POST response model
the end date).
From this same component, the current time should be able to be stopped without starting a
new time.
Using an Observable, continuously update the current time, simulating a timer where we
see at all times which task we are working on.
