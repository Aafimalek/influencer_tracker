# Influencer Post Tracker

A React-based web application for tracking influencer campaigns, managing post details, and monitoring campaign performance across social media platforms. Made with cursor and claude

## 🚀 Features

- **Influencer Management**: Add and track influencers with their profile details
- **Multi-Platform Support**: Track campaigns across Instagram, TikTok, or both
- **Video Tracking**: Monitor up to 4 video posts per influencer with posting dates
- **Status Management**: Track campaign progress with statuses (Posted, Script Needed, Approval Needed, Paid)
- **Campaign Analytics**: View total campaign views and performance metrics
- **Filtering**: Filter influencers by status for better organization
- **Persistent Storage**: Data is automatically saved to browser's local storage
- **Responsive Design**: Mobile-friendly interface that works on all devices

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd my-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Available Scripts

- `npm run dev` - Start development server with hot reload

## 📱 How to Use

1. **Add Influencers**: Fill out the form with influencer details including username, profile link, platform, and expected views
2. **Track Videos**: Add up to 4 video links per influencer with their posting dates
3. **Manage Status**: Update campaign status as it progresses through different stages
4. **Filter Results**: Use the status filter to view specific groups of influencers
5. **Mark as Paid**: Use the action button to mark campaigns as completed/paid
6. **Monitor Performance**: View total campaign views and individual influencer metrics

## ⏱️ Time Spent

**Estimated Development Time: 4-5 hours**

- **Initial Setup & Planning**: 1 hour
  - Project structure setup
  - Dependencies configuration
  - UI/UX planning

- **Core Functionality**: 2 hours
  - Form creation and validation
  - Data management with localStorage
  - Table display and filtering
  - Status management system

- **Styling & Responsive Design**: 30 hours
  - CSS styling and layout
  - Mobile responsiveness
  - Status badges and visual indicators

- **Testing & Refinement**: 1 hours
  - Bug fixes and edge cases
  - User experience improvements
  - Code cleanup and optimization

## 🔧 What I Would Improve Next

### Short-term Improvements
1. **Data Export/Import**: Add functionality to export data to CSV/Excel and import from files
2. **Search Functionality**: Implement search by username or platform
3. **Bulk Actions**: Allow bulk status updates and operations
4. **Data Validation**: Enhanced form validation with better error messages
5. **Edit Functionality**: Allow editing of existing influencer records

### Medium-term Enhancements
1. **Backend Integration**: Replace localStorage with a proper database
2. **User Authentication**: Add user accounts and authentication
3. **Campaign Management**: Group influencers into specific campaigns
4. **Analytics Dashboard**: Advanced charts and performance metrics
5. **Notifications**: Email/SMS notifications for status changes

### Long-term Features
1. **API Integration**: Connect with social media APIs for real-time data
2. **Payment Integration**: Integrate with payment systems for automated payments
3. **Team Collaboration**: Multi-user support with role-based permissions
4. **Mobile App**: Native mobile application
5. **AI Insights**: Predictive analytics and performance recommendations

## 💡 Comments and Notes

### Technical Decisions
- **React with Hooks**: Used functional components with hooks for modern React development
- **Local Storage**: Chosen for simplicity and offline functionality, though not suitable for production
- **CSS-in-CSS**: Used traditional CSS for styling to maintain separation of concerns
- **Responsive Design**: Mobile-first approach with CSS media queries

### Known Limitations
- **Data Persistence**: Data is stored locally and will be lost if browser data is cleared
- **No Backend**: Currently a client-side only application
- **Limited Validation**: Basic form validation, could be more comprehensive
- **No Real-time Updates**: Data doesn't sync across multiple browser tabs/devices

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Local storage support required

### Performance Considerations
- Efficient re-rendering with React hooks
- Responsive design optimized for mobile devices
- Minimal external dependencies for faster loading

## 🏗️ Project Structure

```
my-project/
├── public/
├── src/
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles and responsive design
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```



**Built with React + Vite** | **Styled with Tailwindcss** | **Responsive Design**
