# 🎯 MultiTask Unlock System

A powerful and customizable task-based content unlocking system with a complete admin panel. Perfect for content creators, YouTubers, and community managers who want to increase engagement before providing access to premium content.

![Version](https://img.shields.io/badge/version-5.0-blue)
![PHP](https://img.shields.io/badge/PHP-7.0+-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎨 For Administrators
- **Complete Admin Panel** - Intuitive interface to manage everything
- **Unlimited Tasks** - Add or remove tasks dynamically
- **Custom Icons** - 12 professional icons to choose from (YouTube, Discord, Gaming, etc.)
- **Promotional Banner** - Upload custom images (PNG/JPG up to 2MB)
- **No Coding Required** - Everything managed through the admin panel
- **Real-time Preview** - See changes before publishing

### 👥 For End Users
- **Modern Interface** - Clean and responsive design
- **Visual Progress** - Progress bar showing completion status
- **Smart Unlocking** - Button changes from locked (gray) to unlocked (green)
- **Mobile Friendly** - Works perfectly on all devices
- **No Popups** - Direct redirection after completing tasks

### 🔧 Technical
- **No Database Required** - Uses JSON file storage
- **PHP Backend** - Simple and efficient
- **Session-based Auth** - Secure admin access
- **localStorage Progress** - Individual user progress tracking
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Requirements
- PHP 7.0 or higher
- Web hosting with write permissions
- No database needed

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/multitask-unlock-system.git
cd multitask-unlock-system
```

2. **Upload to your hosting**
Upload all files to your web server's public directory

3. **Configure credentials**
Edit `admin.js` lines 3-6:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'your-username',
    password: 'your-secure-password'
};
```

4. **Access the system**
- Admin Panel: `https://yourdomain.com/admin.php`
- Public MultiTask: `https://yourdomain.com/index.php`

## 📖 Usage

### Admin Panel

1. Login with your credentials
2. Configure general settings:
   - MultiTask title
   - Unlock URL (where users go after completing tasks)
3. Upload a promotional banner (optional)
4. Add/configure tasks:
   - Title and description
   - URL to redirect
   - Icon selection
   - Unlock time (5-60 seconds)
5. Save changes

### For Users

1. User visits the MultiTask page
2. Sees tasks configured by admin
3. Clicks on each task (opens URL in new tab)
4. Timer counts automatically (invisible to user)
5. After completing all tasks, unlock button activates
6. Clicks unlock button → redirected to premium content

## 🎨 Available Icons

- 📺 YouTube (Red)
- 💬 Discord (Purple)
- 🔔 Notification (Purple Light)
- ▶️ Video (Dark Purple)
- 👍 Like (Blue)
- 💬 Comment (Green)
- 🎮 Gaming (Orange)
- 📤 Share (Cyan)
- ❤️ Heart (Pink)
- ⭐ Star (Yellow)
- 🎁 Gift (Red)
- 🏆 Trophy (Yellow)

## 📁 Project Structure
```
multitask-unlock-system/
├── config.php              # Backend API (GET/POST)
├── index.php               # Public MultiTask page
├── admin.php               # Admin panel
├── multitask_config.json   # Auto-generated config file
└── public/
    ├── app.js              # MultiTask logic
    ├── styles.css          # MultiTask styles
    ├── admin.js            # Admin panel logic
    └── admin.css           # Admin panel styles
```

## 🔒 Security

- Admin credentials stored in JavaScript (change before deployment)
- Session-based authentication
- JSON file write permissions required
- No SQL injection risks (no database)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS/Android)

## 📝 Use Cases

- **YouTubers**: Increase subscribers before sharing exclusive content
- **Discord Communities**: Grow server members
- **Contests/Giveaways**: Require actions before participation
- **Product Launches**: Build engagement before release
- **Course Creators**: Gate premium lessons

## 🛠️ Customization

### Changing Colors
Edit `public/admin.css` and `public/styles.css`

### Adding More Icons
Edit the `TASK_ICONS` object in `public/app.js`

### Modifying Behavior
Edit `public/app.js` for frontend logic
Edit `config.php` for backend logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Kevin Fagúndez
- GitHub: https://github.com/Kevinfagundez
- Email: kevinfagundez20@gmail.com

## 🙏 Acknowledgments

- Built with passion for content creators
- Inspired by the need for better engagement tools
- Special thanks to the open-source community

## 📊 Changelog

### v5.0 (2026-01-31)
- ✅ PHP backend implementation
- ✅ Shared configuration for all users
- ✅ Icon system (12 icons)
- ✅ Banner upload feature
- ✅ Dynamic task management
- ✅ Complete admin panel

### v4.0
- ✅ Timer invisible to users
- ✅ Dynamic button states
- ✅ No alerts on completion

### v3.0
- ✅ Custom icons
- ✅ Banner system
- ✅ Unlimited tasks

### v2.0
- ✅ Admin panel
- ✅ Dynamic tasks

### v1.0
- ✅ Basic MultiTask system

## 🔮 Future Enhancements

- [ ] User statistics dashboard
- [ ] Multiple admin users
- [ ] Task scheduling
- [ ] Email notifications
- [ ] API integrations
- [ ] Multi-language support
- [ ] Dark mode

## 💬 Support

For support, please open an issue or contact [kevinfagundez20@gmail.com]

---

⭐ If you find this project useful, please give it a star!
```

---

## **TAGS SUGERIDOS PARA GITHUB:**
```
multitask
engagement
content-gating
php
javascript
admin-panel
youtube
discord
task-manager
unlock-system
content-creator
marketing-tool
no-database
responsive
mobile-friendly
```

---

### 1. **LICENSE (MIT):**
```
MIT License

Copyright (c) 2026 [Kevin Fagúndez - Wev Developer]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 2. **.gitignore:**
```
# Config file (generated)
multitask_config.json

# OS Files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Temporary files
tmp/
temp/
