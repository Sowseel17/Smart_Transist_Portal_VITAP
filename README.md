# Smart Transit Portal (VIT-AP)

A front-end transport booking web application inspired by ride-booking UX patterns.

This project helps users plan travel between VIT-AP University and nearby major locations such as Vijayawada Bus Stand, Vijayawada Railway Station, Vijayawada Airport, and Mangalagiri, with multiple vehicle options and payment flow.

## Live Project Flow

1. User registers on the Sign Up page.
2. User signs in with verified email and password.
3. User selects source and destination on Dashboard.
4. Available transport modes are shown (Bike, Auto, Car) with distance, time, and fare.
5. User chooses a mode and proceeds to Payment page.
6. User selects payment type and confirms booking.
7. Booking status updates end with: **Ride accepted by the captain**.

## Features

- Secure sign-up and sign-in validation
- Password verification (exact match with registered credentials)
- Dashboard with route selection and sorting
- Transport mode listing with:
  - Vehicle type
  - Distance
  - Estimated duration
  - Fare range
- Coverage for all supported source-destination combinations among listed places
- Sorting options:
  - Recommended
  - Lowest Fare
  - Fastest Time
- Payment scenarios:
  - UPI
  - Card
  - Wallet
  - Cash
- Live ride status timeline after booking confirmation
- Responsive, modern, app-like UI/UX

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- LocalStorage (for auth/session/planner state in front-end demo)

## Project Structure

- `index.html` - Sign In page
- `signup.html` - Register page
- `dashboard.html` - Route planning and transport selection
- `payment.html` - Payment and booking status page
- `styles.css` - Shared styling across all pages
- `script.js` - Sign In logic
- `signup.js` - Sign Up logic
- `dashboard.js` - Route engine, sorting, booking state
- `payment.js` - Payment selection and ride status flow

## Run Locally

1. Clone the repository:

```bash
git clone https://github.com/Sowseel17/Smart_Transist_Portal_VITAP.git
```

2. Open the project folder.

3. Run using any static server, or open `index.html` directly in browser.

Recommended (VS Code Live Server):

- Install Live Server extension.
- Right-click `index.html` and select **Open with Live Server**.

## Validation Notes

- This is a front-end demo project.
- User credentials are stored in browser LocalStorage for demonstration.
- For production, replace LocalStorage auth with backend authentication and encrypted password storage.

## Agile Development Note

This project was built using iterative Agile-style updates:

- Incremental UI improvements
- Frequent feature validation
- Continuous bug fixing (routing logic, auth checks, flow consistency)

## Future Enhancements

- Real backend authentication and JWT session handling
- Real-time maps integration (pickup/drop visualization)
- Captain details card (name, rating, vehicle number, ETA)
- Booking history and user profile page
- Razorpay/Stripe integration for real payment processing

## Author

Developed by Sowseel as a Smart Transport Portal project for VIT-AP use case.
