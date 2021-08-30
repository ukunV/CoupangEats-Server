## Architecture

![sdaf](https://user-images.githubusercontent.com/23329560/128726338-7fdd528f-553d-464e-8024-61a28c893587.JPG)

## Structure

```
├── 📂 config
│   ├── 📄 baseResponseStatus.js
│   ├── 📄 database.js
│   ├── 📄 express.js
│   ├── 📄 jwtMiddleware.js
│   ├── 📄 kakao_config.js
│   ├── 📄 mail_config.js
│   ├── 📄 response.js
│   ├── 📄 secret.js
│   ├── 📄 sens_config.js
│   └── 📄 winston.js
├── 📂 controllers
│   ├── 📄 kakao_ctrl.js
│   ├── 📄 mail_ctrl.js
│   ├── 📄 sens_ctrl.js
│   └── 📄 user_ctrl.js
├── 📂 log
├── 📂 node_modules
├── 📂 src
│   └── 📂 app
│      ├── 📂 Address
│      │    ├── 📄 addressDao.js
│      │    ├── 📄 addressController.js
│      │    ├── 📄 addressProvider.js
│      │    └── 📄 addressService.js
│      ├── 📂 admin
│      │    ├── 📄 adminDao.js
│      │    ├── 📄 adminController.js
│      │    ├── 📄 adminProvider.js
│      │    └── 📄 adminService.js
│      ├── 📂 Cart
│      │    ├── 📄 cartDao.js
│      │    ├── 📄 cartController.js
│      │    ├── 📄 cartProvider.js
│      │    └── 📄 cartService.js
│      ├── 📂 Coupon
│      │    ├── 📄 couponDao.js
│      │    ├── 📄 couponController.js
│      │    ├── 📄 couponProvider.js
│      │    └── 📄 couponService.js
│      ├── 📂 Order
│      │    ├── 📄 orderDao.js
│      │    ├── 📄 orderController.js
│      │    ├── 📄 orderProvider.js
│      │    └── 📄 orderService.js
│      ├── 📂 Payment
│      │    ├── 📄 paymentDao.js
│      │    ├── 📄 paymentController.js
│      │    ├── 📄 paymentProvider.js
│      │    └── 📄 paymentService.js
│      ├── 📂 Review
│      │    ├── 📄 reviewDao.js
│      │    ├── 📄 reviewController.js
│      │    ├── 📄 reviewProvider.js
│      │    └── 📄 reviewService.js
│      ├── 📂 Store
│      │    ├── 📄 storeDao.js
│      │    ├── 📄 storeController.js
│      │    ├── 📄 storeProvider.js
│      │    └── 📄 storeService.js
│      └── 📂 User
│           ├── 📄 userDao.js
│           ├── 📄 userController.js
│           ├── 📄 userProvider.js
│           └── 📄 userService.js
│
├── 📄 .gitattributes
├── 📄 .gitignore
├── 📄 index.js
├── 📄 package-lock.json
├── 📄 package.json
└── 📄 README.md
```

## ERD (AqueryTool)

[CoupangEats - ERD](https://aquerytool.com/aquerymain/index/?rurl=82cce02b-e18d-49ae-ad18-abff3b834202)

> password: g5wku1

## API Specification

[CoupangEats - API Specification](https://docs.google.com/spreadsheets/d/1JXW7_XLrDfxpg-_0Ct_up5ghHLRxxosVVmwFoRYQKB8/edit?usp=sharing)
