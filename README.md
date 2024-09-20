# 🚀 SwiftFetch

SwiftFetch is a lightweight, easy-to-use HTTP client for modern web applications. Built on top of the Fetch API, it provides a simple and intuitive interface for making HTTP requests.

## 🌟 Features

- 📦 Lightweight and dependency-free
- 🔧 Easy to use with a familiar API
- 🌐 Works in both browser and Node.js environments
- 🔄 Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- ⏱️ Built-in timeout support
- 🔒 Automatic request and response transformation

## 🚀 Installation

```bash
npm install swift-fetch
# or
yarn add swift-fetch
# or
pnpm add swift-fetch`
```

## 🎯 Quick Start
```javascript
import SwiftFetch from 'swift-fetch';

// Create a SwiftFetch instance
const api = new SwiftFetch({ baseURL: 'https://api.example.com' });

async function fetchData() {
  try {
    // GET request
    const usersResponse = await api.get('/users');
    console.log('Users:', usersResponse.data);

    // POST request
    const newUser = { name: 'John Doe', email: 'john@example.com' };
    const createUserResponse = await api.post('/users', newUser);
    console.log('Created User:', createUserResponse.data);

    // PUT request
    const updatedUser = { ...createUserResponse.data, name: 'John Updated' };
    const updateUserResponse = await api.put(`/users/${updatedUser.id}`, updatedUser);
    console.log('Updated User:', updateUserResponse.data);

    // DELETE request
    const deleteUserResponse = await api.delete(`/users/${updatedUser.id}`);
    console.log('Delete User Response:', deleteUserResponse.status);

    // GET request with query parameters
    const filteredUsersResponse = await api.get('/users', { params: { role: 'admin' } });
    console.log('Filtered Users:', filteredUsersResponse.data);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the async function
fetchData();
```

This example demonstrates how to use SwiftFetch with async/await for various HTTP methods and includes error handling.


## 📚 API Reference

### Creating an instance

```javascript
const api = new SwiftFetch(config);
```

Config options:
- `baseURL`: Base URL for all requests
- `headers`: Default headers for all requests
- `timeout`: Default timeout for all requests (in milliseconds)

### Methods

- `get(url, config)`
- `post(url, data, config)`
- `put(url, data, config)`
- `delete(url, config)`
- `patch(url, data, config)`

All methods return a Promise that resolves with a response object containing:
- `data`: The response data
- `status`: The HTTP status code
- `statusText`: The HTTP status text
- `headers`: The response headers

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/mutasim77/swift-fetch/issues).

## 📝 License

This project is [MIT](/LICENSE) licensed.