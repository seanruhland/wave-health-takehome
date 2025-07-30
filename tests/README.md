# Playwright Tests

This directory contains end-to-end tests for the Wave Health takehome application using Playwright.

## Test Structure

- `home.spec.ts` - Tests for the main home page functionality including search, sorting, and user details modal
- `add-user.spec.ts` - Tests for the add user form including validation and submission
- `components.spec.ts` - Component-specific tests for table, modal, and accessibility features

## Running Tests

### All Tests
```bash
npm test
```

### With UI (Interactive Mode)
```bash
npm run test:ui
```

### With Browser Visible
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Specific Test File
```bash
npx playwright test home.spec.ts
```

### Specific Test
```bash
npx playwright test -g "should display users table"
```

## Test Coverage

### Home Page Tests
- ✅ Display users table with correct data
- ✅ Search users by name, email, and other fields
- ✅ Clear search functionality
- ✅ Table sorting by different columns
- ✅ Open/close user details modal
- ✅ Navigation to add user page
- ✅ User count display
- ✅ Keyboard navigation

### Add User Form Tests
- ✅ Display all form fields
- ✅ Validation for required fields
- ✅ Email format validation
- ✅ Website URL validation
- ✅ Minimum length requirements
- ✅ Successful form submission
- ✅ Cancel functionality
- ✅ Optional fields handling

### Component Tests
- ✅ Table component rendering
- ✅ Modal component functionality
- ✅ Search across all fields
- ✅ Sorting functionality
- ✅ Accessibility features
- ✅ Keyboard navigation
- ✅ Focus management

## Test Configuration

The tests are configured in `playwright.config.ts` with:
- Base URL: `http://localhost:5173`
- Multiple browser support (Chrome, Firefox, Safari)
- Automatic web server startup
- Screenshot capture on failure
- Trace recording for debugging

## Writing New Tests

When adding new tests:

1. Create a new `.spec.ts` file in the `tests/` directory
2. Use descriptive test names that explain the expected behavior
3. Include proper waiting for elements to load
4. Test both positive and negative scenarios
5. Include accessibility considerations
6. Use data attributes or semantic selectors when possible

## Best Practices

- Use `page.waitForSelector()` to ensure elements are loaded
- Use `page.waitForTimeout()` for debounced operations
- Test both mouse and keyboard interactions
- Include accessibility tests
- Use descriptive test names
- Group related tests using `test.describe()`
- Clean up state between tests using `test.beforeEach()`