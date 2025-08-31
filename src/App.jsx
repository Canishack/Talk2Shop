import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- useSpeechRecognition Hook ---
const useSpeechRecognition = (lang = 'en-US') => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);
    const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    const startListening = () => {
        if (!isSupported) {
            setError("Browser doesn't support speech recognition.");
            return;
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = lang;
        recognition.onstart = () => { setIsListening(true); setError(''); setTranscript(''); };
        recognition.onresult = (event) => setTranscript(event.results[0][0].transcript);
        recognition.onerror = (event) => { console.error('Speech recognition error:', event); setError(`Speech recognition error: ${event.error}`); setIsListening(false); };
        recognition.onend = () => setIsListening(false);
        try {
            recognition.start();
        } catch (e) {
            console.error('An error occurred.', e);
            setError('An error occurred.');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return { transcript, isListening, startListening, stopListening, error, isSupported };
};

// --- INLINE SVG ICONS ---
const MicFill = ({ s = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} fill="currentColor" viewBox="0 0 16 16"><path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" /><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" /></svg>);
const MicMuteFill = ({ s = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} fill="currentColor" viewBox="0 0 16 16"><path d="M13 8c0 .564-.094 1.107-.266 1.613l-4.473-4.473A5.002 5.002 0 0 0 8 3c-1.543 0-2.898.85-3.665 2.093l-4.243-4.243A7.002 7.002 0 0 1 8 1c3.866 0 7 3.134 7 7zM4.053 4.276A4.982 4.982 0 0 0 3 8v1a5 5 0 0 0 4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5.002 5.002 0 0 0 4.053 4.276zM1.08 1.08l13.84 13.84a.5.5 0 0 0 .708-.708L1.788 1.08a.5.5 0 0 0-.708.708z" /></svg>);
const CartIcon = ({ s = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" /></svg>);
const CloseIcon = ({ s = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /></svg>);
const SearchIcon = ({ s = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" /></svg>);

// --- MOCK PRODUCT DATA with Keywords and Suggestions ---
const products = [
    { id: 1, name: 'Amul Taaza Toned Milk', brand: 'Amul', quantity: '500ml', price: 27, image: 'https://www.bbassets.com/media/uploads/p/l/40090894_7-amul-taaza.jpg', category: 'Dairy', keywords: ['milk', 'doodh', 'दूध'] },
    { id: 2, name: 'Amul Butter Pasteurised', brand: 'Amul', quantity: '100g', price: 56, image: 'https://www.bbassets.com/media/uploads/p/xl/104860_8-amul-butter-pasteurised.jpg', category: 'Dairy', keywords: ['butter', 'makkhan', 'मक्खन'] },
    { id: 3, name: 'Mother Dairy Classic Curd', brand: 'Mother Dairy', quantity: '400g', price: 35, image: 'https://www.bbassets.com/media/uploads/p/l/40004532_8-mother-dairy-dahi-made-from-toned-milk.jpg', category: 'Dairy', keywords: ['curd', 'dahi', 'दही'] },
    { id: 4, name: 'Amul Cheese Slices', brand: 'Amul', quantity: '200g', price: 135, image: 'https://m.media-amazon.com/images/I/71vM-znOuDL.jpg', category: 'Dairy', keywords: ['cheese', 'paneer', 'पनीर'] },
    { id: 5, name: 'Amul Masti Yoghurt', brand: 'Amul', quantity: '100g', price: 30, image: 'https://m.media-amazon.com/images/I/81GH9Js1xiL.jpg', category: 'Dairy', keywords: ['yoghurt', 'yogurt', 'योगर्ट'] },
    { id: 6, name: 'Fresh Apple', brand: 'Local', quantity: '1kg', price: 120, image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQOmASJvO4ijzdYuPlBR0oYEAYMJbzsUpJL5x5c8Iw8rigTRy7Jp2g-v7-2lmitgBcZONEVs8vsisOMzq7nbE8ySXVu4qb9t9yjkADAvi8', category: 'Fruits', keywords: ['apple', 'seb', 'सेब'] },
    { id: 7, name: 'Pineapple Queen', brand: 'Local', quantity: '1pc', price: 80, image: 'https://www.jiomart.com/images/product/original/590000070/pineapple-queen-1-pc-approx-700-g-1200-g-product-images-o590000070-p590000070-0-202409041925.jpg?im=Resize=(420,420)', category: 'Fruits', keywords: ['pineapple', 'अनानास'] },
    { id: 8, name: 'Ratnagiri Alphonso Mango', brand: 'Local', quantity: '1kg', price: 350, image: 'https://aamrai.com/wp-content/uploads/2024/01/Group-71.webp', category: 'Fruits', keywords: ['mango', 'aam', 'आम'] },
    { id: 9, name: 'Fresho Dragon Fruit', brand: 'Fresho', quantity: '1pc', price: 100, image: 'https://www.bbassets.com/media/uploads/p/l/40008982_17-fresho-dragon-fruit.jpg', category: 'Fruits', keywords: ['dragon fruit', 'ड्रैगन फ्रूट'] },
    { id: 10, name: 'Dozen Bananas', brand: 'Local', quantity: '12 pieces', price: 60, image: 'https://www.bigbasket.com/media/uploads/p/m/10000025_27-fresho-banana-robusta.jpg', category: 'Fruits', keywords: ['banana', 'kele', 'kela', 'केला', 'केले'] },
    { id: 11, name: 'English Oven Brown Bread', brand: 'English Oven', quantity: '400g', price: 50, image: 'https://m.media-amazon.com/images/I/71zLJqDIGTL.jpg', category: 'Bakery', keywords: ['bread', 'roti', 'ब्रेड'] },
    { id: 12, name: 'Chocolate Doughnut', brand: 'Local Bakery', quantity: '1pc', price: 70, image: 'https://www.greatestbakery.in/wp-content/uploads/2022/03/Buy-Doughnut-in-Nagercoil.jpg', category: 'Bakery', keywords: ['doughnut', 'donut', 'डोनट'] },
    { id: 13, name: 'Pancake & Waffle Mix', brand: 'Betty Crocker', quantity: '500g', price: 250, image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRgYeWMfwRq8p_DrD_Tu4RChq3WfzZlO7ZBEkUuKAo6WZRiZ7tjwILPc2P5Kg4kvOq2iLUZBSDyHginQ6V2Tm4HO8dDk23Efw3AMJcg2fdBfNS2qZQFuxNF', category: 'Bakery', keywords: ['pancake', 'waffle', 'पैनकेक'] },
    { id: 14, name: 'Biscoff Cheesecake Slice', brand: 'Local Bakery', quantity: '1 slice', price: 220, image: 'https://prd-upmarket.s3.ap-south-1.amazonaws.com/AA0013/generated/ar1x1/large/BiscoffCheesecake-slice-Large.jpg', category: 'Bakery', keywords: ['cheesecake', 'cake', 'चीज़केक'] },
    { id: 15, name: 'Parle-G Gold Biscuits', brand: 'Parle-G', quantity: '1kg', price: 120, image: 'https://rukminim2.flixcart.com/image/850/1000/kuczmvk0/cookie-biscuit/3/4/a/g-gold-biscuits-parle-original-imag7hvdfyndrvtx.jpeg?q=90', category: 'Bakery', keywords: ['biscuit', 'parle', 'बिस्कुट'] },
    { id: 16, name: 'Lays Potato Chips', brand: 'Lays', quantity: '52g', price: 20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRPPI5Oa7NmY2bIiK_6i1PmrOrrvKCRM6pIQ&s', category: 'Snacks', keywords: ['chips', 'lays', 'चिप्स'] },
    { id: 17, name: 'Pringles Original', brand: 'Pringles', quantity: '100g', price: 99, image: 'https://m.media-amazon.com/images/I/71nDKAex-YL._UF350,350_QL80_.jpg', category: 'Snacks', keywords: ['pringles', 'प्रिंगल्स'] },
    { id: 18, name: 'Haldiram Bhujia', brand: 'Haldiram', quantity: '200g', price: 55, image: 'https://www.pankaj-boutique.com/31504-large_default/namkeens-indian-bhujia.jpg', category: 'Snacks', keywords: ['bhujia', 'namkeen', 'भुजिया'] },
    { id: 19, name: 'Kurkure Masala Munch', brand: 'Kurkure', quantity: '90g', price: 20, image: 'https://rukminim2.flixcart.com/image/704/844/l5iid8w0/snack-savourie/t/c/i/-original-imagg65fez3mdsf5.jpeg?q=90&crop=false', category: 'Snacks', keywords: ['kurkure', 'कुरकुरे'] },
    { id: 20, name: 'Tata Salt', brand: 'Tata', quantity: '1kg', price: 25, image: 'https://m.media-amazon.com/images/I/614mm2hYHyL.jpg', category: 'Pantry', keywords: ['salt', 'namak', 'नमक'] },
    { id: 21, name: 'Aashirvaad Shudh Chakki Atta', brand: 'Aashirvaad', quantity: '5kg', price: 250, image: 'https://m.media-amazon.com/images/I/9104JpXbv6L._UF1000,1000_QL80_.jpg', category: 'Pantry', keywords: ['atta', 'flour', 'आटा'] },
    { id: 22, name: 'Fortune Sun Lite Refined Sunflower Oil', brand: 'Fortune', quantity: '1L', price: 150, image: 'https://m.media-amazon.com/images/I/81FbVYZJYyL.jpg', category: 'Pantry', keywords: ['oil', 'tel', 'तेल'] },
    { id: 23, name: 'Tata Tea Gold', brand: 'Tata Tea', quantity: '250g', price: 150, image: 'https://m.media-amazon.com/images/I/61m1sZRyMqL._UF894,1000_QL80_.jpg', category: 'Pantry', keywords: ['tea', 'chai', 'चाय'] },
    { id: 24, name: 'Colgate MaxFresh Toothpaste', brand: 'Colgate', quantity: '50g', price: 40, image: 'https://m.media-amazon.com/images/I/61f+32QXZML._UF1000,1000_QL80_.jpg', category: 'Pantry', keywords: ['toothpaste', 'colgate', 'टूथपेस्ट'] },
];

const suggestionMap = {
    1: [15, 13], // Milk -> Biscuits, Pancake Mix
    2: [11, 4],  // Butter -> Bread, Cheese
    3: [10, 8],  // Curd -> Bananas, Mango
    4: [11, 16], // Cheese -> Bread, Chips
    6: [10, 3],  // Apple -> Bananas, Curd
    11: [2, 4],  // Bread -> Butter, Cheese
    16: [17, 19],// Lays -> Pringles, Kurkure
    21: [22, 20],// Atta -> Oil, Salt
    23: [15],    // Tea -> Biscuits
};


// --- MAIN APP COMPONENT ---
function App() {
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);
    
    const [language, setLanguage] = useState('en-US');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [message, setMessage] = useState('Tap the mic or use the search bar');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [productSuggestions, setProductSuggestions] = useState([]);
    
    const { transcript: cartTranscript, isListening: isCartListening, startListening: startCartListening } = useSpeechRecognition(language);
    const { transcript: searchTranscript, isListening: isSearchListening, startListening: startSearchListening } = useSpeechRecognition(language);

    const parseCommand = (command) => {
        const lowerCommand = command.toLowerCase().trim();
        const addKeywords = ['add', 'i need', 'buy', 'get', 'want', 'joड़ें', 'chahiye', 'खरीदना', 'जोड़ें', 'चाहिए'];
        const removeKeywords = ['remove', 'delete', 'take off', 'हटाएं', 'हटाओ'];
    
        let action = 'unknown';
        let cleanCommand = lowerCommand;
    
        // Determine action (add/remove)
        for (const keyword of addKeywords) {
            if (lowerCommand.includes(keyword)) {
                action = 'add';
                cleanCommand = cleanCommand.replace(new RegExp(keyword, 'g'), '');
                break;
            }
        }
    
        if (action === 'unknown') {
            for (const keyword of removeKeywords) {
                if (lowerCommand.includes(keyword)) {
                    action = 'remove';
                    cleanCommand = cleanCommand.replace(new RegExp(keyword, 'g'), '');
                    break;
                }
            }
        }
    
        if (action === 'unknown') action = 'add'; // Default to add
    
        // Extract quantity
        let quantity = 1;
        const quantityMatch = cleanCommand.match(/(\d+)\s*(kg|kgs|liter|liters|dozen)?/);
        if (quantityMatch) {
            quantity = parseInt(quantityMatch[1], 10);
            cleanCommand = cleanCommand.replace(quantityMatch[0], '').trim();
        }
    
        cleanCommand = cleanCommand.trim();
        
        // Find product based on keywords
        let foundProduct = null;
        for (const product of products) {
            for (const keyword of product.keywords) {
                if (cleanCommand.includes(keyword)) {
                    foundProduct = product;
                    break;
                }
            }
            if(foundProduct) break;
        }
    
        return { action, product: foundProduct, originalQuery: cleanCommand, quantity };
    };


    const handleVoiceCommand = (command) => {
        const { action, product, originalQuery, quantity } = parseCommand(command);

        if (product) {
            if (action === 'add') {
                addToCart(product, quantity);
                setMessage(`Added ${quantity} of ${product.name} to cart.`);
                generateSuggestions(product.id);
            } else if (action === 'remove') {
                setCart(prev => prev.filter(item => item.id !== product.id));
                setMessage(`Removed ${product.name} from cart.`);
                setProductSuggestions([]);
            }
        } else {
            setMessage(`Sorry, couldn't find "${originalQuery}" in our store.`);
            setProductSuggestions([]);
        }
    };

    const generateSuggestions = (productId) => {
        const suggestionIds = suggestionMap[productId];
        if (suggestionIds) {
            const suggestions = products.filter(p => suggestionIds.includes(p.id));
            setProductSuggestions(suggestions);
        } else {
            setProductSuggestions([]);
        }
    };
    
    useEffect(() => {
        if (cartTranscript) {
            handleVoiceCommand(cartTranscript);
        }
    }, [cartTranscript]);

    useEffect(() => {
        if (searchTranscript) {
            setSearchTerm(searchTranscript);
        }
    }, [searchTranscript]);

    const filteredProducts = useMemo(() => {
        let categoryFiltered = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);
        if (!searchTerm) return categoryFiltered;
        return categoryFiltered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, selectedCategory]);

    const addToCart = (productToAdd, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productToAdd.id);
            if (existingItem) {
                return prevCart.map(item => item.id === productToAdd.id ? { ...item, cartQuantity: item.cartQuantity + quantity } : item);
            }
            return [...prevCart, { ...productToAdd, cartQuantity: quantity }];
        });
        generateSuggestions(productToAdd.id);
    };
    
    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart(prev => prev.filter(item => item.id !== productId));
        } else {
            setCart(prev => prev.map(item => item.id === productId ? { ...item, cartQuantity: newQuantity } : item));
        }
    };
    
    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div className="app-wrapper">
            <style>{`
                /* All CSS styles from App.css go here */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                :root { --primary-color: #2a6cdf; --primary-hover: #1f58b9; --text-dark: #1a1a1a; --text-light: #666; --background-color: #f7f8fa; --card-background: #ffffff; --border-color: #e5e7eb; --success-color: #28a745; --danger-color: #dc3545; }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background-color: var(--background-color); color: var(--text-dark); }
                .app-wrapper { width: 100%; }
                .app-header { width: 100%; border-bottom: 1px solid var(--border-color); background-color: var(--card-background); position: sticky; top: 0; z-index: 100; }
                .header-content { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; width: 100vw; margin: 0 auto; padding: 1rem 2rem; gap: 1rem; }
                .logo { flex-shrink: 0; cursor: pointer; }
                .logo h2 { font-size: 1.5rem; font-weight: 700; color: var(--primary-color); }
                .logo p { font-size: 0.8rem; color: var(--text-light); }
                .search-and-voice { display: flex; align-items: center; gap: 1.5rem; flex-grow: 1; max-width: 700px; }
                .cart-voice-control { display: flex; align-items: center; gap: 0.75rem; margin-left: 1rem; }
                .voice-prompt-text { font-size: 0.9rem; font-weight: 500; color: var(--text-light); white-space: nowrap; }
                .search-bar { position: relative; width: 100%; }
                .search-bar .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-light); }
                .search-input { width: 100%; padding: 0.75rem 3rem 0.75rem 2.5rem; border-radius: 50px; border: 1px solid var(--border-color); background-color: var(--background-color); font-size: 1rem; }
                .search-mic-button { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--primary-color); padding: 0.5rem; display: flex; align-items: center; justify-content: center;}
                .search-mic-button.listening { color: var(--danger-color); }
                .mic-button { background: none; border: none; cursor: pointer; color: var(--primary-color); transition: transform 0.2s ease; display: flex; align-items: center; justify-content: center; }
                .mic-button.listening { color: var(--danger-color); animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                .status-message-bar { text-align: center; padding: 0.5rem 0; height: 50px; display: flex; justify-content: center; align-items: center; gap: 1rem; }
                .status-message { font-size: 0.9rem; color: var(--text-light); }
                .header-controls { display: flex; align-items: center; gap: 1rem; }
                .cart-button { background: none; border: none; cursor: pointer; position: relative; }
                .cart-badge { position: absolute; top: -5px; right: -8px; background-color: var(--danger-color); color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; }
                .category-tabs { display: flex; justify-content: center; gap: 1rem; padding: 1rem 2rem; background-color: var(--card-background); border-bottom: 1px solid var(--border-color); flex-wrap: wrap; position: sticky; z-index: 99; }
                .category-tab { background: none; border: 1px solid var(--border-color); color: var(--text-dark); padding: 0.5rem 1.5rem; border-radius: 20px; cursor: pointer; font-size: 1rem; transition: all 0.2s ease; }
                .category-tab.active { background-color: var(--primary-color); color: white; border-color: var(--primary-color); }
                .suggestions-bar { display: flex; justify-content: center; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background-color: #e9f5e9; border-bottom: 1px solid #c8e6c9; flex-wrap: wrap; }
                .suggestion-pill { background-color: white; border: 1px solid var(--success-color); color: var(--success-color); padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s ease; }
                .suggestion-pill:hover { background-color: var(--success-color); color: white; }
                .product-grid-container { width: 100%; margin: 0 auto; padding: 2rem; }
                .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
                .product-card { background-color: var(--card-background); border: 1px solid var(--border-color); border-radius: 12px; display: flex; flex-direction: column; }
                .product-image-container { padding: 1rem; aspect-ratio: 1 / 1; }
                .product-image { width: 100%; height: 100%; object-fit: contain; }
                .product-info { padding: 0 1rem 1rem; border-top: 1px solid var(--border-color); text-align: center; }
                .product-name { font-size: 1rem; font-weight: 600; margin: 0.5rem 0; }
                .product-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; }
                .add-to-cart-btn { background-color: var(--card-background); color: var(--primary-color); border: 2px solid var(--primary-color); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
                .cart-sidebar { position: fixed; top: 0; right: -100%; width: 100%; max-width: 400px; height: 100%; background-color: white; z-index: 1001; display: flex; flex-direction: column; transition: right 0.3s ease-in-out; }
                .cart-sidebar.open { right: 0; }
                .cart-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000; opacity: 0; visibility: hidden; transition: opacity 0.3s ease; }
                .cart-overlay.open { opacity: 1; visibility: visible; }
                .cart-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); }
                .close-cart-btn { background: none; border: none; cursor: pointer; }
                .cart-items { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
                .cart-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
                .cart-item-image { width: 70px; height: 70px; object-fit: contain; border: 1px solid var(--border-color); border-radius: 8px; }
                .cart-item-details { flex-grow: 1; }
                .cart-item-controls { display: flex; align-items: center; gap: 0.5rem; }
                .cart-item-controls button { width: 28px; height: 28px; border-radius: 50%; }
                .cart-footer { padding: 1.5rem; border-top: 1px solid var(--border-color); }
                .checkout-btn { width: 100%; padding: 1rem; background-color: var(--primary-color); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; }
            `}</style>
            <Header 
                ref={headerRef} 
                {...{ 
                    language, setLanguage, 
                    isCartListening, startCartListening,
                    isSearchListening, startSearchListening,
                    searchTerm, setSearchTerm, 
                    cartItemCount: cart.length, setIsCartOpen 
                }} 
            />
            <div className="status-message-bar">
                <span className="status-message">{isCartListening || isSearchListening ? "Listening..." : message}</span>
            </div>
             {productSuggestions.length > 0 && (
                <div className="suggestions-bar">
                    <span>You might also like:</span>
                    {productSuggestions.map(p => (
                        <button key={p.id} className="suggestion-pill" onClick={() => addToCart(p)}>
                            {p.name}
                        </button>
                    ))}
                </div>
            )}
            <div className="category-tabs" style={{ top: headerHeight }}>
                {categories.map(c => <button key={c} className={`category-tab ${selectedCategory === c ? 'active' : ''}`} onClick={() => setSelectedCategory(c)}>{c}</button>)}
            </div>
            <main className="product-grid-container">
                <div className="product-grid">
                    {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />)}
                </div>
            </main>
            <CartSidebar 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onUpdateQuantity={updateCartQuantity}
            />
        </div>
    );
}

const Header = React.forwardRef(({ language, setLanguage, isCartListening, startCartListening, isSearchListening, startSearchListening, searchTerm, setSearchTerm, cartItemCount, setIsCartOpen }, ref) => (
    <header className="app-header" ref={ref}>
        <div className="header-content">
            <div className="logo" onClick={() => window.location.reload()}>
                <h2>Talk2Shop</h2>
                <p>Your Voice-Powered Shopping Assistant</p>
            </div>
            <div className="search-and-voice">
                 <div className="search-bar">
                    <span className="search-icon"><SearchIcon /></span>
                    <input type="search" placeholder="Search for products..." className="search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <button className={`search-mic-button ${isSearchListening ? 'listening' : ''}`} onClick={startSearchListening}>
                        <MicFill s={20} />
                    </button>
                </div>
                <div className="cart-voice-control">
                     <button className={`mic-button ${isCartListening ? 'listening' : ''}`} onClick={startCartListening}>
                        <MicFill s={26} />
                    </button>
                    <span className="voice-prompt-text">Talk, to add to cart</span>
                </div>
            </div>
            <div className="header-controls">
                <select value={language} onChange={e => setLanguage(e.target.value)} disabled={isCartListening}>
                    <option value="en-US">English</option>
                    <option value="hi-IN">हिन्दी</option>
                </select>
                <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                    <CartIcon />
                    {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </button>
            </div>
        </div>
    </header>
));

const ProductCard = ({ product, onAddToCart }) => (
    <div className="product-card">
        <div className="product-image-container">
            <img src={product.image} alt={product.name} className="product-image" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/f0f0f0/333?text=Image+Not+Found'; }} />
        </div>
        <div className="product-info">
            <p className="product-quantity">{product.quantity}</p>
            <h3 className="product-name">{product.name}</h3>
            <div className="product-footer">
                <p className="product-price">₹{product.price}</p>
                <button className="add-to-cart-btn" onClick={onAddToCart}>ADD</button>
            </div>
        </div>
    </div>
);

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity }) => {
    const cartTotal = useMemo(() =>
        cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0),
    [cartItems]);

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>Your Cart</h3>
                    <button onClick={onClose} className="close-cart-btn"><CloseIcon /></button>
                </div>
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart-message">Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p>{item.name}</p>
                                    <p>₹{item.price}</p>
                                    <div className="cart-item-controls">
                                        <button onClick={() => onUpdateQuantity(item.id, item.cartQuantity - 1)}>-</button>
                                        <span>{item.cartQuantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <h4>Subtotal: ₹{cartTotal.toFixed(2)}</h4>
                        <button className="checkout-btn">Proceed to Checkout</button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default App;

