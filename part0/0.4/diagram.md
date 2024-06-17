# 0.4: New note diagram 

```mermaid

sequenceDiagram

    actor user
    participant browser
    participant server

    user-)browser: writes new note in text input
    activate browser
    deactivate browser
    user->>browser: presses Save button
    activate browser
     
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: Status 302: redirect to /notes
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "note_content", "date": "date_time" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
    browser-->>user: page with new note
    deactivate browser
```