import { icons, images } from "../constants";

export const friends = [
    {
        id: "1",
        name: "Tynisa Obey",
        phoneNumber: "+1-300-400-0135",
        avatar: images.user1,
    },
    {
        id: "2",
        name: "Florencio Dorance",
        phoneNumber: "+1-309-900-0135",
        avatar: images.user2,
    },
    {
        id: "3",
        name: "Chantal Shelburne",
        phoneNumber: "+1-400-100-1009",
        avatar: images.user3,
    },
    {
        id: "4",
        name: "Maryland Winkles",
        phoneNumber: "+1-970-200-4550",
        avatar: images.user4,
    },
    {
        id: "5",
        name: "Rodolfo Goode",
        phoneNumber: "+1-100-200-9800",
        avatar: images.user5,
    },
    {
        id: "6",
        name: "Benny Spanbauer",
        phoneNumber: "+1-780-200-9800",
        avatar: images.user6,
    },
    {
        id: "7",
        name: "Tyra Dillon",
        phoneNumber: "+1-943-230-9899",
        avatar: images.user7,
    },
    {
        id: "8",
        name: "Jamel Eusobio",
        phoneNumber: "+1-900-234-9899",
        avatar: images.user8,
    },
    {
        id: "9",
        name: "Pedro Haurad",
        phoneNumber: "+1-240-234-9899",
        avatar: images.user9
    },
    {
        id: "10",
        name: "Clinton Mcclure",
        phoneNumber: "+1-500-234-4555",
        avatar: images.user10
    },
];

export const faqKeywords = [
    {
        id: "1",
        name: "General"
    },
    {
        id: "2",
        name: "Account"
    },
    {
        id: "3",
        name: "Security"
    },
    {
        id: "4",
        name: "Ordering"
    },
    {
        id: "5",
        name: "Payment"
    }
];

export const faqs = [
    {
        question: 'How do I place an order using the app?',
        answer: 'To place an order, simply open the app, browse through the menu, select your desired items, add them to your cart, and proceed to checkout to confirm your order.',
        type: "General"
    },
    {
        question: 'Can I view details of the dishes, such as ingredients and allergens?',
        answer: 'Yes, you can view details of dishes including ingredients, allergens, and customer ratings. Simply select a dish from the menu provided in the app.',
        type: "General"
    },
    {
        question: 'What should I do if I need to cancel or modify an order?',
        answer: 'To cancel or modify an order, go to the "My Orders" section, find your order, and follow the provided options to make changes.',
        type: "Account"
    },
    {
        question: 'How can I find restaurants offering specific cuisines or dietary options, such as vegan or gluten-free?',
        answer: 'You can use the app’s search filters to find restaurants offering specific cuisines or dietary options. Filter results by categories such as vegan or gluten-free.',
        type: "Ordering"
    },
    {
        question: 'Is there a way to make payments for orders within the app?',
        answer: 'Yes, you can securely make payments for orders using various payment methods available in the app, including credit/debit cards and digital wallets.',
        type: "Payment"
    },
    {
        question: 'Are my personal details and order information kept secure?',
        answer: 'Yes, we prioritize the security and confidentiality of your personal details and order information. Our app complies with strict privacy and data protection standards.',
        type: "Security"
    },
    {
        question: 'Can I request additional assistance with special dietary requirements or preferences for my order?',
        answer: "Yes, you can request additional assistance with special dietary requirements or preferences during the ordering process. Simply specify your preferences, and we'll do our best to accommodate them.",
        type: "General"
    },
    {
        question: 'How can I provide feedback or rate my food delivery experience?',
        answer: 'After receiving your order, you can provide feedback and rate your experience through the app’s rating and review system. Your feedback helps us improve our services for future orders.',
        type: "General"
    },
    {
        question: 'Is customer support available through this app?',
        answer: 'While we provide food delivery services, our app is not for customer support. For assistance, please contact our support team through the designated channels provided in the app.',
        type: "General"
    },
];

export const messsagesData = [
    {
        id: "1",
        fullName: "Jhon Smith",
        isOnline: false,
        userImg: images.user1,
        lastSeen: "2023-11-16T04:52:06.501Z",
        lastMessage: 'I love you. see you soon baby',
        messageInQueue: 2,
        lastMessageTime: "12:25 PM",
        isOnline: true,
    },
    {
        id: "2",
        fullName: "Anuska Sharma",
        isOnline: false,
        userImg: images.user2,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'I Know. you are so busy man.',
        messageInQueue: 0,
        lastMessageTime: "12:15 PM",
        isOnline: false
    },
    {
        id: "3",
        fullName: "Virat Kohili",
        isOnline: false,
        userImg: images.user3,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Ok, see u soon',
        messageInQueue: 0,
        lastMessageTime: "09:12 PM",
        isOnline: true
    },
    {
        id: "4",
        fullName: "Shikhor Dhaon",
        isOnline: false,
        userImg: images.user4,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'Great! Do you Love it.',
        messageInQueue: 0,
        lastMessageTime: "04:12 PM",
        isOnline: true
    },
    {
        id: "5",
        fullName: "Shakib Hasan",
        isOnline: false,
        userImg: images.user5,
        lastSeen: "2023-11-21T04:52:06.501Z",
        lastMessage: 'Thank you !',
        messageInQueue: 2,
        lastMessageTime: "10:30 AM",
        isOnline: true
    },
    {
        id: "6",
        fullName: "Jacksoon",
        isOnline: false,
        userImg: images.user6,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Do you want to go out dinner',
        messageInQueue: 3,
        lastMessageTime: "10:05 PM",
        isOnline: false
    },
    {
        id: "7",
        fullName: "Tom Jerry",
        isOnline: false,
        userImg: images.user7,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Do you want to go out dinner',
        messageInQueue: 2,
        lastMessageTime: "11:05 PM",
        isOnline: true
    },
    {
        id: "8",
        fullName: "Lucky Luck",
        isOnline: false,
        userImg: images.user8,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Can you share the design with me?',
        messageInQueue: 2,
        lastMessageTime: "09:11 PM",
        isOnline: true
    },
    {
        id: "9",
        fullName: "Nate Jack",
        isOnline: false,
        userImg: images.user9,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Tell me what you want?',
        messageInQueue: 0,
        lastMessageTime: "06:43 PM",
        isOnline: true
    }
];

export const callData = [
    {
        id: "1",
        fullName: "Roselle Erhman",
        userImg: images.user10,
        status: "Incoming",
        date: "Dec 19, 2024"
    },
    {
        id: "2",
        fullName: "Willard Purnell",
        userImg: images.user9,
        status: "Outgoing",
        date: "Dec 17, 2024"
    },
    {
        id: "3",
        fullName: "Charlotte Hanlin",
        userImg: images.user8,
        status: "Missed",
        date: "Dec 16, 2024"
    },
    {
        id: "4",
        fullName: "Merlin Kevin",
        userImg: images.user7,
        status: "Missed",
        date: "Dec 16, 2024"
    },
    {
        id: "5",
        fullName: "Lavern Laboy",
        userImg: images.user6,
        status: "Outgoing",
        date: "Dec 16, 2024"
    },
    {
        id: "6",
        fullName: "Phyllis Godley",
        userImg: images.user5,
        status: "Incoming",
        date: "Dec 15, 2024"
    },
    {
        id: "7",
        fullName: "Tyra Dillon",
        userImg: images.user4,
        status: "Outgoing",
        date: "Dec 15, 2024"
    },
    {
        id: "8",
        fullName: "Marci Center",
        userImg: images.user3,
        status: "Missed",
        date: "Dec 15, 2024"
    },
    {
        id: "9",
        fullName: "Clinton Mccure",
        userImg: images.user2,
        status: "Outgoing",
        date: "Dec 15, 2024"
    },
];

export const notifications = [
    {
        id: "1",
        icon: icons.chat,
        title: "Kathryn sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "2",
        icon: icons.box,
        title: "Congratulations! Order Successful!",
        description: "You have successfully ordered a pizza for $90. Enjoy the services!",
        date: "2024-01-23T04:52:06.501Z"
    },
    {
        id: "3",
        icon: icons.chat,
        title: "New Services Available!",
        description: "You can now make multiple order at once. You can also cancel your order.",
        date: "2024-01-23T08:52:06.501Z"
    },
    {
        id: "4",
        icon: icons.discount,
        title: "Get 20% Discount for your next order!",
        description: "For all orderings without requirements",
        date: "2024-01-28T08:52:06.501Z"
    },
    {
        id: "5",
        icon: icons.chat,
        title: "New Category foods available!",
        description: "We have added New Service. Enjoy our new service!",
        date: "2024-01-29T08:52:06.501Z"
    },
    {
        id: "6",
        icon: icons.box,
        title: "Credit card successfully connected!",
        description: "Credit card has been successfully linked!",
        date: "2024-01-23T04:52:06.501Z"
    },
    {
        id: "7",
        icon: icons.chat,
        title: "Julia sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "8",
        icon: icons.chat,
        title: "Joanna sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "9",
        icon: icons.chat,
        title: "Lilia sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "10",
        icon: icons.box,
        title: "Account Setup Successfully",
        description: "Your account has been created!",
        date: "2024-01-28T04:52:06.501Z"
    },
    {
        id: "11",
        icon: icons.discount,
        title: "Get 50% Discount for First Order!",
        description: "For all transaction without requirements",
        date: "2024-01-28T08:52:06.501Z"
    },
    {
        id: "12",
        icon: icons.chat,
        title: "Mily sent you a message",
        description: "Tap to see the message",
        date: "2024-01-31T04:52:06.501Z"
    },
];

export const userAddresses = [
    {
        id: "1",
        name: "Home",
        address: "364 Stillwater Ave, Attleboro, MA 02703",
    },
    {
        id: "2",
        name: "Office",
        address: "73 Virginia Rd, Cuyahoga Falls, OH 44221",
    },
    {
        id: "3",
        name: "Mall Plaza",
        address: "123 Main St, San Francisco, CA 94107",
    },
    {
        id: "4",
        name: "Garden Park",
        address: "600 Bloom St, Portland, OR 97201",
    },
    {
        id: "5",
        name: "Grand City Park",
        address: "26 State St Daphne, AL 36526"
    },
    {
        id: "6",
        name: "Town Square",
        address: "20 Applegate St. Hoboken, NJ 07030"
    },
    {
        id: "7",
        name: "Bank",
        address: "917 W Pine Street Easton, PA 0423"
    }
];

export const transactionHistory = [
    {
        id: "1",
        image: images.user1,
        name: "Daniel Austin",
        date: "Dec 20, 2024 | 10:00 AM",
        type: "Taxi Expense",
        amount: "$14"
    },
    {
        id: "2",
        image: images.user2,
        name: "Top Up Wallet",
        date: "Dec 16, 2024 | 13:34 PM",
        type: "Top Up",
        amount: "$80"
    },
    {
        id: "3",
        image: images.user3,
        name: "Sarah Wilson",
        date: "Dec 14, 2024 | 11:39 AM",
        type: "Taxi Expense",
        amount: "$32"
    },
    {
        id: "4",
        image: images.user2,
        name: "Daniel Austion",
        date: "Dec 10, 2024 | 09:32 AM",
        type: "Top Up",
        amount: "$112"
    },
    {
        id: "5",
        image: images.user5,
        name: "Benny Spanbauleur",
        date: "Dec 09, 2024 | 10:08 AM",
        type: "Taxi Expense",
        amount: "$43"
    },
    {
        id: "6",
        image: images.user6,
        name: "Roselle Dorrence",
        date: "Dec 08, 2024 | 09:12 AM",
        type: "Taxi Expense",
        amount: "$22"
    },
    {
        id: "7",
        image: images.user2,
        name: "Daniel Austion",
        date: "Dec 08, 2024 | 16:28 PM",
        type: "Top Up",
        amount: "$200"
    },
    {
        id: "8",
        image: images.user2,
        name: "Daniel Austion",
        date: "Dec 07, 2024 | 15:12 PM",
        type: "Top Up",
        amount: "$120"
    },
    {
        id: "9",
        image: images.user2,
        name: "Daniel Austion",
        date: "Dec 07, 2024 | 22:12 PM",
        type: "Top Up",
        amount: "$20"
    },
    {
        id: "10",
        image: images.user8,
        name: "Lucky Luck",
        date: "Dec 06, 2024 | 10:08 AM",
        type: "Taxi Expense",
        amount: "$12"
    },
    {
        id: "11",
        image: images.user2,
        name: "Jennifer Lucie",
        date: "Dec 03, 2024 | 11:48 AM",
        type: "Top Up",
        amount: "$45"
    }
];

export const banners = [
    {
        id: 1,
        discount: '40%',
        discountName: "Today's Special",
        bottomTitle: 'Get a discount for every orde!',
        bottomSubtitle: 'Only valid for today!'
    },
    {
        id: 2,
        discount: '50%',
        discountName: "Weekend Sale",
        bottomTitle: 'Special discount for weekend orderings!',
        bottomSubtitle: 'This weekend only!'
    },
    {
        id: 3,
        discount: '30%',
        discountName: "Limited Time Offer",
        bottomTitle: 'Hurry up! Limited time offer!',
        bottomSubtitle: 'Valid until supplies last!'
    }
];

export const categories = [
    {
        id: "1",
        name: "Burger",
        icon: icons.burger,
        iconColor: "rgba(51, 94, 247, 1)",
        backgroundColor: "rgba(51, 94, 247, .12)",
        onPress: "CategoryHamburger"
    },
    {
        id: "2",
        name: "Pizza",
        icon: icons.pizza,
        iconColor: "rgba(255, 152, 31, 1)",
        backgroundColor: "rgba(255, 152, 31, .12)",
        onPress: "CategoryPizza"
    },
    {
        id: "3",
        name: "Noodles",
        icon: icons.noodles,
        iconColor: "rgba(26, 150, 240, 1)",
        backgroundColor: "rgba(26, 150, 240,.12)",
        onPress: null
    },
    {
        id: "4",
        name: "Meat",
        icon: icons.meat,
        iconColor: "rgba(255, 192, 45, 1)",
        backgroundColor: "rgba(255, 192, 45,.12)",
        onPress: "CategoryMeat"
    },
    {
        id: "5",
        name: "Vegetables",
        icon: icons.vegetable,
        iconColor: "rgba(245, 67, 54, 1)",
        backgroundColor: "rgba(245, 67, 54,.12)",
        onPress: null
    },
    {
        id: "6",
        name: "Dessert",
        icon: icons.dessert,
        iconColor: "rgba(74, 175, 87, 1)",
        backgroundColor: "rgba(74, 175, 87,.12)",
        onPress: null
    },
    {
        id: "7",
        name: "Drink",
        icon: icons.healthyDrink,
        iconColor: "rgba(0, 188, 211, 1)",
        backgroundColor: "rgba(0, 188, 211,.12)",
        onPress: null
    },
    {
        id: "8",
        name: "Bread",
        icon: icons.bread,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: "CategoryBread"
    },
    {
        id: "9",
        name: "Croissant",
        icon: icons.croissant,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "10",
        name: "Pancakes",
        icon: icons.pancake,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "11",
        name: "Cheese",
        icon: icons.cheese,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "12",
        name: "Sandwich",
        icon: icons.sandwich,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "13",
        name: "Taco",
        icon: icons.taco,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "14",
        name: "Salad",
        icon: icons.salad,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "15",
        name: "Bento",
        icon: icons.bento,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "16",
        name: "Rice",
        icon: icons.rice,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "17",
        name: "Spaghetti",
        icon: icons.spaghetti,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "18",
        name: "Sushi",
        icon: icons.sushi,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "19",
        name: "Ice Cream",
        icon: icons.iceCream,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    },
    {
        id: "20",
        name: "Cookies",
        icon: icons.cookie,
        iconColor: "rgba(114, 16, 255, 1)",
        backgroundColor: "rgba(114, 16, 255, .12)",
        onPress: null
    }
];


export const foods = [
    {
        id: "1",
        name: "Classic Pepperoni Pizza",
        image: images.pizza1,
        distance: "100 m",
        price: "$10.00",
        fee: "$2.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "1",
    },
    {
        id: "2",
        name: "Double Cheeseburger",
        image: images.hamburger1,
        distance: "1.2 km",
        price: "$8.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1k",
        categoryId: "2",
    },
    {
        id: "3",
        name: "Garlic Breadsticks",
        image: images.bread1,
        distance: "1.6 km",
        price: "$6.00",
        fee: "$1.50",
        rating: 4.5,
        numReviews: "800",
        categoryId: "3",
    },
    {
        id: "4",
        name: "Grilled Chicken Sandwich",
        image: images.meat1,
        distance: "2.5 km",
        price: "$9.00",
        fee: "$2.00",
        rating: 4.7,
        numReviews: "900",
        categoryId: "4",
    },
    {
        id: "5",
        name: "Caesar Salad",
        image: images.salad1,
        distance: "800 m",
        price: "$12.00",
        fee: "$2.50",
        rating: 4.6,
        numReviews: "1.1k",
        categoryId: "5",
    },
    {
        id: "6",
        name: "Vegetarian Supreme Pizza",
        image: images.pizza2,
        distance: "3.0 km",
        price: "$15.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.5k",
        categoryId: "1",
    },
    {
        id: "7",
        name: "Bacon Cheeseburger",
        image: images.hamburger2,
        distance: "2.0 km",
        price: "$10.00",
        fee: "$1.50",
        rating: 4.7,
        numReviews: "950",
        categoryId: "2",
    },
    {
        id: "8",
        name: "Freshly Baked Baguette",
        image: images.bread2,
        distance: "1.8 km",
        price: "$5.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1.4k",
        categoryId: "3",
    },
    {
        id: "9",
        name: "BBQ Pork Ribs",
        image: images.meat2,
        distance: "1.4 km",
        price: "$18.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "4",
    },
];

export const myFavouriteFoods = [
    {
        id: "1",
        name: "Classic Pepperoni Pizza",
        image: images.pizza1,
        distance: "100 m",
        price: "$10.00",
        fee: "$2.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "1",
    },
    {
        id: "2",
        name: "Double Cheeseburger",
        image: images.hamburger1,
        distance: "1.2 km",
        price: "$8.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1k",
        categoryId: "2",
    },
    {
        id: "3",
        name: "Garlic Breadsticks",
        image: images.bread1,
        distance: "1.6 km",
        price: "$6.00",
        fee: "$1.50",
        rating: 4.5,
        numReviews: "800",
        categoryId: "3",
    },
    {
        id: "4",
        name: "Grilled Chicken Sandwich",
        image: images.meat1,
        distance: "2.5 km",
        price: "$9.00",
        fee: "$2.00",
        rating: 4.7,
        numReviews: "900",
        categoryId: "4",
    },
    {
        id: "5",
        name: "Caesar Salad",
        image: images.salad1,
        distance: "800 m",
        price: "$12.00",
        fee: "$2.50",
        rating: 4.6,
        numReviews: "1.1k",
        categoryId: "5",
    },
    {
        id: "6",
        name: "Vegetarian Supreme Pizza",
        image: images.pizza2,
        distance: "3.0 km",
        price: "$15.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.5k",
        categoryId: "1",
    },
    {
        id: "7",
        name: "Bacon Cheeseburger",
        image: images.hamburger2,
        distance: "2.0 km",
        price: "$10.00",
        fee: "$1.50",
        rating: 4.7,
        numReviews: "950",
        categoryId: "2",
    },
    {
        id: "8",
        name: "Freshly Baked Baguette",
        image: images.bread2,
        distance: "1.8 km",
        price: "$5.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1.4k",
        categoryId: "3",
    },
    {
        id: "9",
        name: "BBQ Pork Ribs",
        image: images.meat2,
        distance: "1.4 km",
        price: "$18.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "4",
    },
];

export const foodMenu = [
    {
        id: "1",
        name: "Classic Pepperoni Pizza",
        image: images.pizza1,
        price: "$10.00",
        categoryId: "4",
        isBestSeller: true,
    },
    {
        id: "2",
        name: "Margherita Pizza",
        image: images.pizza2,
        price: "$9.00",
        categoryId: "4",
        isBestSeller: false,
    },
    {
        id: "3",
        name: "Supreme Pizza",
        image: images.pizza3,
        price: "$12.00",
        categoryId: "4",
        isBestSeller: false,
    },
    {
        id: "4",
        name: "BBQ Chicken Pizza",
        image: images.pizza4,
        price: "$13.00",
        categoryId: "4",
        isBestSeller: false,
    },
    {
        id: "5",
        name: "Vegetarian Pizza",
        image: images.pizza5,
        price: "$11.00",
        categoryId: "4",
        isBestSeller: false,
    },
    {
        id: "6",
        name: "Hawaiian Pizza",
        image: images.pizza6,
        price: "$12.00",
        categoryId: "4",
        isBestSeller: false,
    },
    {
        id: "7",
        name: "Meat Lovers Pizza",
        image: images.pizza7,
        price: "$14.00",
        categoryId: "4",
        isBestSeller: false
    },
    {
        id: "8",
        name: "Buffalo Chicken Pizza",
        image: images.pizza8,
        price: "$13.50",
        categoryId: "4",
        isBestSeller: false
    }
];

export const menu = [
    {
        id: "1",
        name: "Caesar Salad",
        image: images.salad1,
        price: "$12.00",
        categoryId: "5",
        isNew: true
    },
    {
        id: "2",
        name: "Garlic Breadsticks",
        image: images.bread1,
        price: "$6.00",
        categoryId: "3",
        isNew: false
    },
    {
        id: "7",
        name: "Bacon Cheeseburger",
        image: images.hamburger2,
        price: "$10.00",
        categoryId: "2",
        isNew: false
    },
];

export const drink = [
    {
        id: "1",
        name: "Fresh Avocado Juice",
        image: images.drink1,
        price: "$4.00",
        categoryId: "5",
        isPromo: true
    },
    {
        id: "2",
        name: "Fresh Orange Juice",
        image: images.drink2,
        price: "$6.00",
        categoryId: "3",
        isPromo: false
    },
    {
        id: "7",
        name: "Fresh Mango Juice",
        image: images.drink3,
        price: "$8.00",
        categoryId: "2",
        isNew: false
    },
]

export const discountFoods = [
    {
        id: "1",
        name: "Classic Pepperoni Pizza",
        image: images.pizza1,
        distance: "100 m",
        price: "$10.00",
        fee: "$2.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "1",
    },
    {
        id: "2",
        name: "Double Cheeseburger",
        image: images.hamburger1,
        distance: "1.2 km",
        price: "$8.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1k",
        categoryId: "2",
    },
    {
        id: "3",
        name: "Garlic Breadsticks",
        image: images.bread1,
        distance: "1.6 km",
        price: "$6.00",
        fee: "$1.50",
        rating: 4.5,
        numReviews: "800",
        categoryId: "3",
    },
    {
        id: "4",
        name: "Grilled Chicken Sandwich",
        image: images.meat1,
        distance: "2.5 km",
        price: "$9.00",
        fee: "$2.00",
        rating: 4.7,
        numReviews: "900",
        categoryId: "4",
    },
    {
        id: "5",
        name: "Caesar Salad",
        image: images.salad1,
        distance: "800 m",
        price: "$12.00",
        fee: "$2.50",
        rating: 4.6,
        numReviews: "1.1k",
        categoryId: "5",
    },
    {
        id: "6",
        name: "Vegetarian Supreme Pizza",
        image: images.pizza2,
        distance: "3.0 km",
        price: "$15.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.5k",
        categoryId: "1",
    },
    {
        id: "7",
        name: "Bacon Cheeseburger",
        image: images.hamburger2,
        distance: "2.0 km",
        price: "$10.00",
        fee: "$1.50",
        rating: 4.7,
        numReviews: "950",
        categoryId: "2",
    },
    {
        id: "8",
        name: "Freshly Baked Baguette",
        image: images.bread2,
        distance: "1.8 km",
        price: "$5.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1.4k",
        categoryId: "3",
    },
    {
        id: "9",
        name: "BBQ Pork Ribs",
        image: images.meat2,
        distance: "1.4 km",
        price: "$18.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "4",
    },
];

export const recommendedFoods = [
    {
        id: "1",
        name: "Classic Pepperoni Pizza",
        image: images.pizza1,
        distance: "100 m",
        price: "$10.00",
        fee: "$2.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "1",
        isPromo: true
    },
    {
        id: "2",
        name: "Double Cheeseburger",
        image: images.hamburger1,
        distance: "1.2 km",
        price: "$8.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1k",
        categoryId: "2",
        isPromo: false
    },
    {
        id: "3",
        name: "Garlic Breadsticks",
        image: images.bread1,
        distance: "1.6 km",
        price: "$6.00",
        fee: "$1.50",
        rating: 4.5,
        numReviews: "800",
        categoryId: "3",
        isPromo: true
    },
    {
        id: "4",
        name: "Grilled Chicken Sandwich",
        image: images.meat1,
        distance: "2.5 km",
        price: "$9.00",
        fee: "$2.00",
        rating: 4.7,
        numReviews: "900",
        categoryId: "4",
        isPromo: false
    },
    {
        id: "5",
        name: "Caesar Salad",
        image: images.salad1,
        distance: "800 m",
        price: "$12.00",
        fee: "$2.50",
        rating: 4.6,
        numReviews: "1.1k",
        categoryId: "5",
        isPromo: true
    },
    {
        id: "6",
        name: "Vegetarian Supreme Pizza",
        image: images.pizza2,
        distance: "3.0 km",
        price: "$15.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.5k",
        categoryId: "1",
        isPromo: true
    },
    {
        id: "7",
        name: "Bacon Cheeseburger",
        image: images.hamburger2,
        distance: "2.0 km",
        price: "$10.00",
        fee: "$1.50",
        rating: 4.7,
        numReviews: "950",
        categoryId: "2",
        isPromo: false
    },
    {
        id: "8",
        name: "Freshly Baked Baguette",
        image: images.bread2,
        distance: "1.8 km",
        price: "$5.00",
        fee: "$1.00",
        rating: 4.9,
        numReviews: "1.4k",
        categoryId: "3",
        isPromo: false
    },
    {
        id: "9",
        name: "BBQ Pork Ribs",
        image: images.meat2,
        distance: "1.4 km",
        price: "$18.00",
        fee: "$3.00",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "4",
        isPromo: true
    },
];

export const hamburgerFoods = [
    {
        id: "1",
        name: "Classic Hamburger",
        image: images.hamburger1,
        distance: "100 m",
        price: "$8.00",
        fee: "$1.00",
        rating: 4.7,
        numReviews: "1.2k",
        categoryId: "1",
    },
    {
        id: "2",
        name: "Bacon Cheeseburger",
        image: images.hamburger2,
        distance: "1.2 km",
        price: "$10.00",
        fee: "$1.50",
        rating: 4.6,
        numReviews: "1k",
        categoryId: "1",
    },
    {
        id: "3",
        name: "Double Cheeseburger",
        image: images.hamburger3,
        distance: "1.6 km",
        price: "$12.00",
        fee: "$2.00",
        rating: 4.8,
        numReviews: "1.3k",
        categoryId: "1",
    },
    {
        id: "4",
        name: "Spicy Chicken Burger",
        image: images.hamburger4,
        distance: "2.5 km",
        price: "$9.00",
        fee: "$1.50",
        rating: 4.5,
        numReviews: "900",
        categoryId: "1",
    },
    {
        id: "5",
        name: "Mushroom Swiss Burger",
        image: images.hamburger5,
        distance: "800 m",
        price: "$11.00",
        fee: "$2.00",
        rating: 4.9,
        numReviews: "800",
        categoryId: "1",
    },
    {
        id: "6",
        name: "Avocado Turkey Burger",
        image: images.hamburger6,
        distance: "3.0 km",
        price: "$13.00",
        fee: "$2.50",
        rating: 4.7,
        numReviews: "1.1k",
        categoryId: "1",
    },
    {
        id: "7",
        name: "BBQ Bacon Burger",
        image: images.hamburger7,
        distance: "2.0 km",
        price: "$10.00",
        fee: "$1.50",
        rating: 4.6,
        numReviews: "950",
        categoryId: "1",
    },
    {
        id: "8",
        name: "Veggie Burger",
        image: images.hamburger8,
        distance: "1.8 km",
        price: "$8.00",
        fee: "$1.00",
        rating: 4.8,
        numReviews: "1.4k",
        categoryId: "1",
    },
    {
        id: "9",
        name: "Teriyaki Chicken Burger",
        image: images.hamburger9,
        distance: "1.4 km",
        price: "$11.00",
        fee: "$2.00",
        rating: 4.9,
        numReviews: "1.2k",
        categoryId: "1",
    },
];

export const breadFoods = [
    {
        id: "1",
        name: "Garlic Breadsticks",
        image: images.bread1,
        distance: "100 m",
        price: "$6.00",
        fee: "$1.00",
        rating: 4.5,
        numReviews: "1.2k",
        categoryId: "2",
    },
    {
        id: "2",
        name: "Freshly Baked Baguette",
        image: images.bread2,
        distance: "1.2 km",
        price: "$4.00",
        fee: "$1.50",
        rating: 4.4,
        numReviews: "1k",
        categoryId: "2",
    },
    {
        id: "3",
        name: "Whole Wheat Sandwich Bread",
        image: images.bread3,
        distance: "1.6 km",
        price: "$5.00",
        fee: "$2.00",
        rating: 4.6,
        numReviews: "1.3k",
        categoryId: "2",
    },
    {
        id: "4",
        name: "French Croissant",
        image: images.bread4,
        distance: "2.5 km",
        price: "$3.00",
        fee: "$1.50",
        rating: 4.7,
        numReviews: "900",
        categoryId: "2",
    },
    {
        id: "5",
        name: "Cinnamon Raisin Bagel",
        image: images.bread5,
        distance: "800 m",
        price: "$2.50",
        fee: "$2.00",
        rating: 4.3,
        numReviews: "800",
        categoryId: "2",
    },
    {
        id: "6",
        name: "Sourdough Loaf",
        image: images.bread6,
        distance: "3.0 km",
        price: "$6.00",
        fee: "$2.50",
        rating: 4.8,
        numReviews: "1.1k",
        categoryId: "2",
    },
    {
        id: "7",
        name: "Bagel with Cream Cheese",
        image: images.bread7,
        distance: "2.0 km",
        price: "$4.50",
        fee: "$1.50",
        rating: 4.4,
        numReviews: "950",
        categoryId: "2",
    },
    {
        id: "8",
        name: "Rye Bread",
        image: images.bread8,
        distance: "1.8 km",
        price: "$5.00",
        fee: "$1.00",
        rating: 4.5,
        numReviews: "1.4k",
        categoryId: "2",
    },
    {
        id: "9",
        name: "Brioche Bun",
        image: images.bread9,
        distance: "1.4 km",
        price: "$3.50",
        fee: "$1.00",
        rating: 4.6,
        numReviews: "1.2k",
        categoryId: "2",
    },
];

export const meatFoods = [
    {
        id: "1",
        name: "Grilled Chicken Sandwich",
        image: images.meat1,
        distance: "100 m",
        price: "$9.00",
        fee: "$1.00",
        rating: 4.7,
        numReviews: "1.2k",
        categoryId: "3",
    },
    {
        id: "2",
        name: "BBQ Pork Ribs",
        image: images.meat2,
        distance: "1.2 km",
        price: "$15.00",
        fee: "$1.50",
        rating: 4.6,
        numReviews: "1k",
        categoryId: "3",
    },
    {
        id: "3",
        name: "Teriyaki Beef Bowl",
        image: images.meat3,
        distance: "1.6 km",
        price: "$12.00",
        fee: "$2.00",
        rating: 4.8,
        numReviews: "1.3k",
        categoryId: "3",
    },
    {
        id: "4",
        name: "Spicy Lamb Curry",
        image: images.meat4,
        distance: "2.5 km",
        price: "$11.00",
        fee: "$1.50",
        rating: 4.7,
        numReviews: "900",
        categoryId: "3",
    },
    {
        id: "5",
        name: "Sizzling Steak",
        image: images.meat5,
        distance: "800 m",
        price: "$20.00",
        fee: "$2.00",
        rating: 4.9,
        numReviews: "800",
        categoryId: "3",
    },
    {
        id: "6",
        name: "Turkey Club Sandwich",
        image: images.meat6,
        distance: "3.0 km",
        price: "$10.00",
        fee: "$2.50",
        rating: 4.7,
        numReviews: "1.1k",
        categoryId: "3",
    },
    {
        id: "7",
        name: "Beef Burger with Bacon",
        image: images.meat7,
        distance: "2.0 km",
        price: "$13.00",
        fee: "$1.50",
        rating: 4.6,
        numReviews: "950",
        categoryId: "3",
    },
    {
        id: "8",
        name: "Honey Glazed Ham",
        image: images.meat8,
        distance: "1.8 km",
        price: "$14.00",
        fee: "$1.00",
        rating: 4.5,
        numReviews: "1.4k",
        categoryId: "3",
    },
    {
        id: "9",
        name: "Crispy Chicken Tenders",
        image: images.meat9,
        distance: "1.4 km",
        price: "$8.50",
        fee: "$1.00",
        rating: 4.6,
        numReviews: "1.2k",
        categoryId: "3",
    },
];

export const pizzaFoods = [
    {
        id: "1",
        name: "Classic Pepperoni Pizza",
        image: images.pizza1,
        distance: "100 m",
        price: "$10.00",
        fee: "$1.50",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "4",
    },
    {
        id: "2",
        name: "Margherita Pizza",
        image: images.pizza2,
        distance: "1.2 km",
        price: "$9.00",
        fee: "$1.00",
        rating: 4.7,
        numReviews: "1k",
        categoryId: "4",
    },
    {
        id: "3",
        name: "Supreme Pizza",
        image: images.pizza3,
        distance: "1.6 km",
        price: "$12.00",
        fee: "$2.00",
        rating: 4.9,
        numReviews: "1.3k",
        categoryId: "4",
    },
    {
        id: "4",
        name: "BBQ Chicken Pizza",
        image: images.pizza4,
        distance: "2.5 km",
        price: "$13.00",
        fee: "$2.50",
        rating: 4.7,
        numReviews: "900",
        categoryId: "4",
    },
    {
        id: "5",
        name: "Vegetarian Pizza",
        image: images.pizza5,
        distance: "800 m",
        price: "$11.00",
        fee: "$1.50",
        rating: 4.6,
        numReviews: "800",
        categoryId: "4",
    },
    {
        id: "6",
        name: "Hawaiian Pizza",
        image: images.pizza6,
        distance: "3.0 km",
        price: "$12.00",
        fee: "$2.00",
        rating: 4.5,
        numReviews: "1.1k",
        categoryId: "4",
    },
    {
        id: "7",
        name: "Meat Lovers Pizza",
        image: images.pizza7,
        distance: "2.0 km",
        price: "$14.00",
        fee: "$2.00",
        rating: 4.8,
        numReviews: "950",
        categoryId: "4",
    },
    {
        id: "8",
        name: "Buffalo Chicken Pizza",
        image: images.pizza8,
        distance: "1.8 km",
        price: "$13.50",
        fee: "$2.00",
        rating: 4.9,
        numReviews: "1.4k",
        categoryId: "4",
    },
    {
        id: "9",
        name: "Four Cheese Pizza",
        image: images.pizza9,
        distance: "1.4 km",
        price: "$12.00",
        fee: "$1.50",
        rating: 4.8,
        numReviews: "1.2k",
        categoryId: "4",
    },
];

export const ratings = [
    {
        id: "1",
        title: "All"
    },
    {
        id: "6",
        title: "5"
    },
    {
        id: "5",
        title: "4"
    },
    {
        id: "4",
        title: "3"
    },
    {
        id: "3",
        title: "2"
    },
    {
        id: "2",
        title: "1"
    }
];

export const cuisines = [
    {
        id: "1",
        name: "All"
    },
    {
        id: "2",
        name: "Dessert"
    },
    {
        id: "3",
        name: "Beverages"
    },
    {
        id: "4",
        name: "Snack"
    },
    {
        id: "5",
        name: "Chicken"
    },
    {
        id: "6",
        name: "Bakery and cake"
    },
    {
        id: "7",
        name: "Breakfast"
    },
    {
        id: "8",
        name: "Chinese"
    },
    {
        id: "9",
        name: "Japanese"
    },
    {
        id: "10",
        name: "Fast Food"
    },
    {
        id: "11",
        name: "Noodles"
    },
    {
        id: "12",
        name: "Seafood"
    },
    {
        id: "13",
        name: "Pizza & Pasta"
    },
    {
        id: "14",
        name: "Hamburger"
    },
    {
        id: "15",
        name: "Lunch"
    },
];

export const foodReviews = [
    {
        id: "1",
        avatar: images.user1,
        name: "John Smith",
        description: "The Big Garden Salad was simply divine! The freshness of the ingredients and the variety of flavors made it a delightful experience. Highly recommended! 😍",
        rating: 4.8,
        avgRating: 5,
        date: "2024-03-28T12:00:00.000Z",
        numLikes: 320
    },
    {
        id: "2",
        avatar: images.user2,
        name: "Emily Davis",
        description: "I thoroughly enjoyed the Big Garden Salad. The combination of vegetables was perfect, and the dressing was delicious. Definitely ordering it again!",
        rating: 4.7,
        avgRating: 5,
        date: "2024-03-28T12:00:00.000Z",
        numLikes: 95
    },
    {
        id: "3",
        avatar: images.user3,
        name: "Michael Rodriguez",
        description: "The Big Garden Salad exceeded my expectations! The portion size was generous, and the freshness of the ingredients was remarkable. Will be back for more!",
        rating: 4.9,
        avgRating: 5,
        date: "2024-03-29T12:00:00.000Z",
        numLikes: 210
    },
    {
        id: "4",
        avatar: images.user4,
        name: "Sarah Brown",
        description: "I had a wonderful experience with the Big Garden Salad. The quality of the produce was outstanding, and it was so flavorful. Highly recommend trying it!",
        rating: 4.5,
        avgRating: 5,
        date: "2024-03-29T12:00:00.000Z",
        numLikes: 150
    },
    {
        id: "5",
        avatar: images.user5,
        name: "David Wilson",
        description: "Absolutely delicious! The Big Garden Salad was fresh, crisp, and bursting with flavor. It's a must-try for any salad lover!",
        rating: 3.8,
        avgRating: 4,
        date: "2024-02-31T12:00:00.000Z",
        numLikes: 500
    },
    {
        id: "6",
        avatar: images.user6,
        name: "Luca Dalasias",
        description: "The Big Garden Salad exceeded my expectations! The portion size was generous, and the freshness of the ingredients was remarkable. Will be back for more!",
        rating: 4.8,
        avgRating: 5,
        date: "2024-02-29T12:00:00.000Z",
        numLikes: 210
    },
];

export const myCart = [
    {
        id: "1",
        name: "Mixed Salad bon", 
        image1: images.salad1, 
        image2: images.salad2, 
        image3: images.salad3, 
        numItems: 2, 
        distance: "1.2 Km",
        price: "$10", 
    },
    {
        id: "2",
        name: "Avocado Turkey Burger",
        image1: images.hamburger6,
        image2: images.hamburger3,
        image3: images.hamburger6,
        price: "$13.00", 
        numItems: 2, 
        distance: "1.2 Km", 
    },
    {
        id: "3",
        name: "Hawaiian Pizza",
        image1: images.pizza1,
        image2: images.pizza2,
        image3: images.pizza4,
        price: "$22.00", 
        numItems: 2, 
        distance: "4.1 Km",
    },
    {
        id: "4",
        name: "Bagel with Cream Cheese",
        image1: images.bread1,
        image2: images.bread2,
        image3: images.bread4,
        price: "$9.00", 
        numItems: 1, 
        distance: "1.1 Km",
    },
    {
        id: "5",
        name: "BBQ Bacon Burger",
        image1: images.hamburger6,
        image2: images.hamburger7,
        image3: images.hamburger8,
        price: "$7.00", 
        numItems: 2, 
        distance: "2.4 Km",
    },
    {
        id: "6",
        name: "Spicy Lamb Curry",
        image1: images.meat1,
        image2: images.meat2,
        image3: images.meat3,
        price: "$16.00", 
        numItems: 1, 
        distance: "1.7 Km",
    },
    {
        id: "7",
        name: "Classic Pepperoni Pizza",
        image1: images.pizza5,
        image2: images.pizza6,
        image3: images.pizza7,
        price: "$11.00", 
        numItems: 1, 
        distance: "2.3 Km",
    },
];

export const activeOrders = [
    {
      id: 1,
      status: "Scheduled",
      date: "15 Feb, 10:00 AM",
      name: "Margherita Pizza",
      image: images.pizza1,
      totalPrice: 29.99,
      address: "123 Main St, Cityville",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.9,
    },
    {
      id: 2,
      status: "Scheduled",
      date: "16 Feb, 2:00 PM",
      name: "Cheeseburger",
      image: images.hamburger2,
      totalPrice: 19.99,
      address: "456 Oak St, Townsville",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.7
    },
    {
      id: 3,
      status: "Scheduled",
      date: "17 Feb, 9:00 AM",
      name: "Caesar Salad",
      image: images.salad1,
      totalPrice: 24.99,
      address: "789 Pine St, Villagetown",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.8
    },
    {
      id: 4,
      status: "Scheduled",
      date: "18 Feb, 3:00 PM",
      name: "Pepperoni Pizza",
      image: images.pizza3,
      totalPrice: 39.99,
      address: "910 Elm St, Hamlet",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.7
    },
    {
      id: 5,
      status: "Scheduled",
      date: "19 Feb, 11:00 AM",
      name: "Grilled Chicken Salad",
      image: images.salad3,
      totalPrice: 49.99,
      address: "321 Maple St, Suburbia",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 6,
      status: "Scheduled",
      date: "20 Feb, 1:00 PM",
      name: "BBQ Meat Lover's Pizza",
      image: images.pizza5,
      totalPrice: 34.99,
      address: "567 Cedar St, Countryside",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 7,
      status: "Scheduled",
      date: "21 Feb, 10:30 AM",
      name: "Turkey Burger",
      image: images.hamburger6,
      totalPrice: 29.99,
      address: "890 Oakwood Dr, Riverside",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 8,
      status: "Scheduled",
      date: "22 Feb, 4:00 PM",
      name: "Garlic Breadsticks",
      image: images.bread4,
      totalPrice: 44.99,
      address: "123 Pinecone Ln, Lakeside",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 9,
      status: "Scheduled",
      date: "23 Feb, 12:00 PM",
      name: "Mushroom Swiss Burger",
      image: images.hamburger8,
      totalPrice: 59.99,
      address: "456 Redwood Rd, Mountainview",
      status: "Paid",
      hasRemindMe: true,
      rating: 4.6
    },
  ];
  
  export const completedOrders = [
    {
      id: 1,
      status: "Completed",
      date: "12 Feb, 11:30 AM",
      name: "Mushroom Swiss Burger",
      image: images.hamburger8,
      totalPrice: 129.99,
      address: "789 Pine St, Villagetown",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 2,
      status: "Completed",
      date: "14 Feb, 3:00 PM",
      name: "Garlic Breadsticks",
      image: images.bread4,
      totalPrice: 199.99,
      address: "910 Elm St, Hamlet",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.6,
    },
    {
      id: 3,
      status: "Completed",
      date: "16 Feb, 1:30 PM",
      name: "Cheeseburger",
      image: images.hamburger2,
      totalPrice: 349.99,
      address: "321 Maple St, Suburbia",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.7,
    },
    {
      id: 4,
      status: "Completed",
      date: "17 Feb, 12:00 PM",
      name: "Margherita Pizza",
      image: images.pizza1,
      totalPrice: 499.99,
      address: "567 Cedar St, Countryside",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 5,
      status: "Completed",
      date: "18 Feb, 2:30 PM",
      name: "Turkey Burger",
      image: images.hamburger6,
      totalPrice: 79.99,
      address: "890 Oakwood Dr, Riverside",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.6,
    },
    {
      id: 6,
      status: "Completed",
      date: "19 Feb, 11:30 AM",
      name: "Grilled Chicken Sandwich",
      image: images.meat1,
      totalPrice: 129.99,
      address: "123 Pinecone Ln, Lakeside",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 7,
      status: "Completed",
      date: "20 Feb, 10:00 AM",
      name: "Margherita Pizza",
      image: images.pizza2,
      totalPrice: 39.99,
      address: "456 Redwood Rd, Mountainview",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 8,
      status: "Completed",
      date: "21 Feb, 3:30 PM",
      name: "Classic Pepperoni Pizza",
      image: images.pizza1,
      totalPrice: 299.99,
      address: "789 Elmwood Ave, Lakeshore",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.7,
    },
    {
      id: 9,
      status: "Completed",
      date: "22 Feb, 2:00 PM",
      name: "Bagel with Cream Cheese",
      image: images.bread7,
      totalPrice: 159.99,
      address: "910 Birch St, Brookside",
      status: "Paid",
      hasRemindMe: false,
      rating: 4.8
    },
  ];
  
  export const cancelledOrders = [
    {
      id: 1,
      status: "Cancelled",
      date: "12 Feb, 11:30 AM",
      name: "Vegetarian Pizza",
      image: images.pizza3,
      totalPrice: 129.99,
      address: "789 Pine St, Villagetown",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 2,
      status: "Cancelled",
      date: "14 Feb, 3:00 PM",
      name: "Caesar Salad",
      image: images.salad2,
      totalPrice: 199.99,
      address: "910 Elm St, Hamlet",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 3,
      status: "Cancelled",
      date: "16 Feb, 1:30 PM",
      name: "BBQ Chicken Wings",
      image: images.meat3,
      totalPrice: 349.99,
      address: "321 Maple St, Suburbia",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 4,
      status: "Cancelled",
      date: "17 Feb, 12:00 PM",
      name: "Grilled Cheese Sandwich",
      image: images.bread9,
      totalPrice: 499.99,
      address: "567 Cedar St, Countryside",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 5,
      status: "Cancelled",
      date: "18 Feb, 2:30 PM",
      name: "Pepperoni Pizza",
      image: images.pizza4,
      totalPrice: 79.99,
      address: "890 Oakwood Dr, Riverside",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 6,
      status: "Cancelled",
      date: "19 Feb, 11:30 AM",
      name: "Mushroom Swiss Burger",
      image: images.hamburger8,
      totalPrice: 129.99,
      address: "123 Pinecone Ln, Lakeside",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 7,
      status: "Cancelled",
      date: "20 Feb, 10:00 AM",
      name: "Chicken Caesar Wrap",
      image: images.meat4,
      totalPrice: 39.99,
      address: "456 Redwood Rd, Mountainview",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 8,
      status: "Cancelled",
      date: "21 Feb, 3:30 PM",
      name: "Cheeseburger",
      image: images.hamburger2,
      totalPrice: 299.99,
      address: "789 Elmwood Ave, Lakeshore",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
    {
      id: 9,
      status: "Cancelled",
      date: "22 Feb, 2:00 PM",
      name: "Garlic Breadsticks",
      image: images.bread4,
      totalPrice: 159.99,
      address: "910 Birch St, Brookside",
      status: "Refunded",
      hasRemindMe: false,
      rating: null,
    },
  ];
  