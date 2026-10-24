(()=>{"use strict";module.exports = [
"[project]/app/components/FoodSearch.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FoodSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/expanded-catalogue.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function FoodSearch({ onSelect, placeholder = "Search foods... (e.g., banana, cheese, lettuce)", autoFocus = false }) {
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const resultsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Create Fuse instance for fuzzy search
    const fuse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Prepare search data
        const searchData = [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].map((m)=>({
                    type: 'material',
                    item: m,
                    category: m.category
                })),
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compositeFoods"].map((cf)=>({
                    type: 'composite',
                    item: cf,
                    category: cf.category
                }))
        ];
        // Initialize Fuse with options
        fuse.current = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](searchData, {
            keys: [
                {
                    name: 'item.name',
                    weight: 2
                },
                {
                    name: 'item.aliases',
                    weight: 1.5
                },
                {
                    name: 'category',
                    weight: 0.5
                }
            ],
            threshold: 0.4,
            includeScore: true,
            minMatchCharLength: 2
        });
    }, []);
    // Handle search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!query.trim()) {
            // Show all when empty, grouped by category
            const allResults = [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["materials"].map((m)=>({
                        type: 'material',
                        item: m,
                        category: m.category
                    })),
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compositeFoods"].map((cf)=>({
                        type: 'composite',
                        item: cf,
                        category: cf.category
                    }))
            ];
            // Filter by selected category if any
            const filtered = selectedCategory ? allResults.filter((r)=>r.category === selectedCategory) : allResults;
            setResults(filtered.slice(0, 20)); // Limit to 20
            return;
        }
        if (fuse.current) {
            const searchResults = fuse.current.search(query);
            const mapped = searchResults.map((r)=>({
                    ...r.item,
                    score: r.score
                }));
            // Filter by category if selected
            const filtered = selectedCategory ? mapped.filter((r)=>r.category === selectedCategory) : mapped;
            setResults(filtered.slice(0, 20));
        }
    }, [
        query,
        selectedCategory
    ]);
    // Keyboard navigation
    const handleKeyDown = (e)=>{
        if (!isOpen) return;
        switch(e.key){
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev)=>prev < results.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev)=>prev > 0 ? prev - 1 : results.length - 1);
                break;
            case 'Enter':
                e.preventDefault();
                const selectedResult = results[highlightedIndex];
                if (selectedResult) {
                    handleSelect(selectedResult);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };
    const handleSelect = (result)=>{
        onSelect(result);
        setQuery('');
        setIsOpen(false);
        setHighlightedIndex(0);
    };
    // Scroll highlighted item into view
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (resultsRef.current) {
            const highlighted = resultsRef.current.children[highlightedIndex];
            if (highlighted) {
                highlighted.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [
        highlightedIndex
    ]);
    // Click outside to close
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (e)=>{
            if (inputRef.current && !inputRef.current.contains(e.target) && resultsRef.current && !resultsRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const getCategoryIcon = (cat)=>{
        const catInfo = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categories"][cat];
        return catInfo?.icon || '🍽️';
    };
    const getCategoryName = (cat)=>{
        const catInfo = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categories"][cat];
        return catInfo?.name || cat;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "food-search",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "category-filters",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `category-chip ${!selectedCategory ? 'active' : ''}`,
                        onClick: ()=>setSelectedCategory(null),
                        children: "All"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FoodSearch.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categories"]).map(([key, cat])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `category-chip ${selectedCategory === key ? 'active' : ''}`,
                            onClick: ()=>setSelectedCategory(key),
                            title: cat.description,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "chip-icon",
                                    children: cat.icon
                                }, void 0, false, {
                                    fileName: "[project]/app/components/FoodSearch.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                cat.name
                            ]
                        }, key, true, {
                            fileName: "[project]/app/components/FoodSearch.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FoodSearch.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "search-input-wrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        type: "text",
                        value: query,
                        onChange: (e)=>{
                            setQuery(e.target.value);
                            setIsOpen(true);
                            setHighlightedIndex(0);
                        },
                        onFocus: ()=>setIsOpen(true),
                        onKeyDown: handleKeyDown,
                        placeholder: placeholder,
                        className: "search-input",
                        autoFocus: autoFocus,
                        "aria-label": "Search for food items",
                        "aria-autocomplete": "list",
                        "aria-controls": "search-results",
                        "aria-expanded": isOpen && results.length > 0
                    }, void 0, false, {
                        fileName: "[project]/app/components/FoodSearch.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this),
                    query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "clear-search",
                        onClick: ()=>{
                            setQuery('');
                            inputRef.current?.focus();
                        },
                        "aria-label": "Clear search",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FoodSearch.tsx",
                        lineNumber: 235,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FoodSearch.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            isOpen && results.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: resultsRef,
                id: "search-results",
                className: "search-results",
                role: "listbox",
                children: results.map((result, index)=>{
                    const item = result.item;
                    const isComposite = result.type === 'composite';
                    const name = item.name;
                    const serving = 'typicalServing' in item ? item.typicalServing : 0;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `search-result-item ${index === highlightedIndex ? 'highlighted' : ''}`,
                        onClick: ()=>handleSelect(result),
                        onMouseEnter: ()=>setHighlightedIndex(index),
                        role: "option",
                        "aria-selected": index === highlightedIndex,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "result-icon",
                                children: getCategoryIcon(result.category)
                            }, void 0, false, {
                                fileName: "[project]/app/components/FoodSearch.tsx",
                                lineNumber: 271,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "result-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "result-name",
                                        children: name
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/FoodSearch.tsx",
                                        lineNumber: 275,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "result-meta",
                                        children: [
                                            getCategoryName(result.category),
                                            serving > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "meta-divider",
                                                children: "·"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/FoodSearch.tsx",
                                                lineNumber: 278,
                                                columnNumber: 37
                                            }, this),
                                            serving > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    serving,
                                                    "g typical"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/FoodSearch.tsx",
                                                lineNumber: 279,
                                                columnNumber: 37
                                            }, this),
                                            isComposite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "meta-divider",
                                                        children: "·"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/FoodSearch.tsx",
                                                        lineNumber: 282,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "composite-badge",
                                                        children: "Mixed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/FoodSearch.tsx",
                                                        lineNumber: 283,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/FoodSearch.tsx",
                                                lineNumber: 281,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/FoodSearch.tsx",
                                        lineNumber: 276,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/FoodSearch.tsx",
                                lineNumber: 274,
                                columnNumber: 17
                            }, this),
                            !isComposite && 'part' in item && item.part !== 'whole' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "result-part",
                                children: item.part
                            }, void 0, false, {
                                fileName: "[project]/app/components/FoodSearch.tsx",
                                lineNumber: 289,
                                columnNumber: 19
                            }, this)
                        ]
                    }, `${result.type}-${item.id}`, true, {
                        fileName: "[project]/app/components/FoodSearch.tsx",
                        lineNumber: 263,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/components/FoodSearch.tsx",
                lineNumber: 250,
                columnNumber: 9
            }, this),
            isOpen && query && results.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "search-results",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "no-results",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "🔍"
                        }, void 0, false, {
                            fileName: "[project]/app/components/FoodSearch.tsx",
                            lineNumber: 301,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                'No foods found for "',
                                query,
                                '"'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/FoodSearch.tsx",
                            lineNumber: 302,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                            children: "Try searching for banana, apple, cheese, or lettuce"
                        }, void 0, false, {
                            fileName: "[project]/app/components/FoodSearch.tsx",
                            lineNumber: 303,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/FoodSearch.tsx",
                    lineNumber: 300,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FoodSearch.tsx",
                lineNumber: 299,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FoodSearch.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/QuantityInput.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuantityInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const commonFractions = [
    {
        value: '1/4',
        label: '1/4',
        decimal: 0.25
    },
    {
        value: '1/3',
        label: '1/3',
        decimal: 0.333
    },
    {
        value: '1/2',
        label: '1/2',
        decimal: 0.5
    },
    {
        value: '2/3',
        label: '2/3',
        decimal: 0.667
    },
    {
        value: '3/4',
        label: '3/4',
        decimal: 0.75
    },
    {
        value: '1',
        label: '1 (whole)',
        decimal: 1
    },
    {
        value: '1.5',
        label: '1 1/2',
        decimal: 1.5
    },
    {
        value: '2',
        label: '2',
        decimal: 2
    },
    {
        value: '3',
        label: '3',
        decimal: 3
    }
];
function QuantityInput({ typicalServing, onQuantityChange, initialValue }) {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('quick');
    const [selectedFraction, setSelectedFraction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('1');
    const [customGrams, setCustomGrams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(String(typicalServing));
    const [customPercentage, setCustomPercentage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('100');
    const [customUnit, setCustomUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('grams');
    // Initialize with initial value if provided
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialValue) {
            if (initialValue.unit === 'fraction' || initialValue.unit === 'whole') {
                setMode('quick');
                setSelectedFraction(initialValue.fraction || String(initialValue.amount));
            } else {
                setMode('custom');
                setCustomUnit(initialValue.unit === 'grams' ? 'grams' : 'percentage');
                if (initialValue.unit === 'grams') {
                    setCustomGrams(String(initialValue.amount));
                } else if (initialValue.unit === 'percentage') {
                    setCustomPercentage(String(initialValue.amount));
                }
            }
        }
    }, [
        initialValue
    ]);
    // Emit changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mode === 'quick') {
            const fraction = commonFractions.find((f)=>f.value === selectedFraction);
            if (fraction) {
                onQuantityChange({
                    amount: fraction.decimal,
                    unit: fraction.decimal === 1 ? 'whole' : 'fraction',
                    fraction: fraction.value
                });
            }
        } else {
            if (customUnit === 'grams') {
                const grams = parseFloat(customGrams);
                if (!isNaN(grams) && grams > 0) {
                    onQuantityChange({
                        amount: grams,
                        unit: 'grams'
                    });
                }
            } else {
                const percentage = parseFloat(customPercentage);
                if (!isNaN(percentage) && percentage > 0) {
                    onQuantityChange({
                        amount: percentage,
                        unit: 'percentage'
                    });
                }
            }
        }
    }, [
        mode,
        selectedFraction,
        customGrams,
        customPercentage,
        customUnit,
        onQuantityChange
    ]);
    const handleQuickSelect = (value)=>{
        setSelectedFraction(value);
    };
    const calculateGrams = ()=>{
        if (mode === 'quick') {
            const fraction = commonFractions.find((f)=>f.value === selectedFraction);
            return fraction ? Math.round(fraction.decimal * typicalServing) : typicalServing;
        }
        if (customUnit === 'grams') {
            return parseFloat(customGrams) || 0;
        }
        const percentage = parseFloat(customPercentage) || 0;
        return Math.round(percentage / 100 * typicalServing);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "quantity-input",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "quantity-mode-toggle",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `mode-button ${mode === 'quick' ? 'active' : ''}`,
                        onClick: ()=>setMode('quick'),
                        children: "Quick Select"
                    }, void 0, false, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `mode-button ${mode === 'custom' ? 'active' : ''}`,
                        onClick: ()=>setMode('custom'),
                        children: "Custom Amount"
                    }, void 0, false, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/QuantityInput.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            mode === 'quick' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "quick-select",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "quantity-label",
                        children: "How much are you composting?"
                    }, void 0, false, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fraction-grid",
                        children: commonFractions.map(({ value, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `fraction-button ${selectedFraction === value ? 'selected' : ''}`,
                                onClick: ()=>handleQuickSelect(value),
                                "aria-label": `${label} of typical serving`,
                                children: label
                            }, value, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 132,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quantity-preview",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "preview-icon",
                                children: "≈"
                            }, void 0, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "preview-value",
                                children: [
                                    calculateGrams(),
                                    "g"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "preview-text",
                                children: "of food waste"
                            }, void 0, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/QuantityInput.tsx",
                lineNumber: 128,
                columnNumber: 9
            }, this),
            mode === 'custom' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "custom-input",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "quantity-label",
                        children: "Enter amount:"
                    }, void 0, false, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "unit-selector",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `unit-button ${customUnit === 'grams' ? 'active' : ''}`,
                                onClick: ()=>setCustomUnit('grams'),
                                children: "Grams (g)"
                            }, void 0, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `unit-button ${customUnit === 'percentage' ? 'active' : ''}`,
                                onClick: ()=>setCustomUnit('percentage'),
                                children: "Percentage (%)"
                            }, void 0, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "custom-input-field",
                        children: [
                            customUnit === 'grams' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: "1",
                                max: "10000",
                                step: "1",
                                value: customGrams,
                                onChange: (e)=>setCustomGrams(e.target.value),
                                placeholder: "Enter grams",
                                "aria-label": "Amount in grams"
                            }, void 0, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: "1",
                                max: "1000",
                                step: "1",
                                value: customPercentage,
                                onChange: (e)=>setCustomPercentage(e.target.value),
                                placeholder: "Enter percentage",
                                "aria-label": "Percentage of typical serving"
                            }, void 0, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "input-unit",
                                children: customUnit === 'grams' ? 'g' : '%'
                            }, void 0, false, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quantity-preview",
                        children: [
                            customUnit === 'percentage' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "preview-icon",
                                        children: "≈"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/QuantityInput.tsx",
                                        lineNumber: 204,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "preview-value",
                                        children: [
                                            calculateGrams(),
                                            "g"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/QuantityInput.tsx",
                                        lineNumber: 205,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "preview-text",
                                        children: [
                                            "(",
                                            customPercentage,
                                            "% of ",
                                            typicalServing,
                                            "g typical serving)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/QuantityInput.tsx",
                                        lineNumber: 206,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, this),
                            customUnit === 'grams' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "preview-text",
                                children: [
                                    "Typical serving: ",
                                    typicalServing,
                                    "g"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/QuantityInput.tsx",
                                lineNumber: 212,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/QuantityInput.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/QuantityInput.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/QuantityInput.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/SelectedFoodsList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SelectedFoodsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/expanded-catalogue.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuantityInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/QuantityInput.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function SelectedFoodsList({ foods, onUpdateQuantity, onRemove, onClear }) {
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    if (foods.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "selected-foods-empty",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "empty-icon",
                    children: "🌱"
                }, void 0, false, {
                    fileName: "[project]/app/components/SelectedFoodsList.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "empty-title",
                    children: "No foods selected yet"
                }, void 0, false, {
                    fileName: "[project]/app/components/SelectedFoodsList.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "empty-subtitle",
                    children: "Search and select foods above to start tracking your composting impact"
                }, void 0, false, {
                    fileName: "[project]/app/components/SelectedFoodsList.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/SelectedFoodsList.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this);
    }
    const getCategoryIcon = (category)=>{
        const cat = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categories"][category];
        return cat?.icon || '🍽️';
    };
    const totalMass = foods.reduce((sum, food)=>sum + food.massGrams, 0);
    const handleQuantityChange = (id, typicalServing)=>(value)=>{
            let massGrams;
            if (value.unit === 'grams') {
                massGrams = value.amount;
            } else if (value.unit === 'percentage') {
                massGrams = value.amount / 100 * typicalServing;
            } else {
                // fraction or whole
                massGrams = value.amount * typicalServing;
            }
            onUpdateQuantity(id, value, massGrams);
        };
    const formatQuantity = (food)=>{
        const { quantity } = food;
        if (quantity.unit === 'whole') {
            return quantity.amount === 1 ? '1 whole' : `${quantity.amount} whole`;
        }
        if (quantity.unit === 'fraction' && quantity.fraction) {
            return quantity.fraction;
        }
        if (quantity.unit === 'percentage') {
            return `${quantity.amount}%`;
        }
        if (quantity.unit === 'grams') {
            return `${Math.round(quantity.amount)}g`;
        }
        return String(quantity.amount);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "selected-foods-list",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "list-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Your Compost Pile"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "list-subtitle",
                                children: [
                                    foods.length,
                                    " item",
                                    foods.length !== 1 ? 's' : '',
                                    " · ",
                                    Math.round(totalMass),
                                    "g total"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    foods.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "clear-all-button",
                        onClick: onClear,
                        "aria-label": "Clear all foods",
                        children: "Clear all"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "food-items",
                children: foods.map((food)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "food-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "food-item-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "food-item-main",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "food-icon",
                                                children: getCategoryIcon(food.category)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                lineNumber: 117,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "food-info",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "food-name",
                                                        children: [
                                                            food.name,
                                                            food.part && food.part !== 'whole' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "food-part",
                                                                children: [
                                                                    " (",
                                                                    food.part,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                                lineNumber: 122,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "food-quantity",
                                                        children: [
                                                            formatQuantity(food),
                                                            " · ",
                                                            Math.round(food.massGrams),
                                                            "g"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                lineNumber: 118,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "food-actions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "edit-button",
                                                onClick: ()=>setEditingId(editingId === food.id ? null : food.id),
                                                "aria-label": `Edit quantity for ${food.name}`,
                                                "aria-expanded": editingId === food.id,
                                                children: editingId === food.id ? '✓' : '⚙'
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "remove-button",
                                                onClick: ()=>onRemove(food.id),
                                                "aria-label": `Remove ${food.name}`,
                                                children: "✕"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                lineNumber: 140,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this),
                            editingId === food.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "food-item-editor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuantityInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    typicalServing: food.typicalServing,
                                    onQuantityChange: handleQuantityChange(food.id, food.typicalServing),
                                    initialValue: food.quantity
                                }, void 0, false, {
                                    fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                    lineNumber: 153,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 152,
                                columnNumber: 15
                            }, this),
                            food.type === 'composite' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "composite-breakdown",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "breakdown-label",
                                                    children: "View ingredients"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "breakdown-icon",
                                                    children: "⌄"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                            lineNumber: 165,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "breakdown-content",
                                            children: (()=>{
                                                const composite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompositeFoodById"])(food.id);
                                                if (!composite) return null;
                                                return composite.components.map((comp)=>{
                                                    const material = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaterialById"])(comp.materialId);
                                                    if (!material) return null;
                                                    const componentMass = food.massGrams * comp.percentage / 100;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "breakdown-item",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "breakdown-name",
                                                                children: material.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                                lineNumber: 182,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "breakdown-amount",
                                                                children: [
                                                                    comp.percentage,
                                                                    "% · ",
                                                                    Math.round(componentMass),
                                                                    "g"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                                lineNumber: 183,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, comp.materialId, true, {
                                                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 27
                                                    }, this);
                                                });
                                            })()
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                            lineNumber: 169,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                    lineNumber: 164,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 163,
                                columnNumber: 15
                            }, this)
                        ]
                    }, food.id, true, {
                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "list-footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-stat",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "stat-label",
                                children: "Total food waste"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "stat-value",
                                children: [
                                    Math.round(totalMass),
                                    "g"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-stat",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "stat-label",
                                children: "Items tracked"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "stat-value",
                                children: foods.length
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SelectedFoodsList.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SelectedFoodsList.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SelectedFoodsList.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/compost-tracker/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CompostTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FoodSearch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/FoodSearch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuantityInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/QuantityInput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SelectedFoodsList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SelectedFoodsList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nutrient$2d$calculator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/nutrient-calculator.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
function Sprout({ className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 48 48",
        fill: "none",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M24 43V23M24 29C8 30 5 17 7 7c13 0 22 7 17 22ZM24 22C23 8 34 4 43 5c0 12-6 20-19 17Z",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/app/compost-tracker/page.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/compost-tracker/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
function CompostTracker() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selectedFoods, setSelectedFoods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pendingSelection, setPendingSelection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showQuantityModal, setShowQuantityModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [calculatedResults, setCalculatedResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showResults, setShowResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleFoodSelect = (result)=>{
        setPendingSelection(result);
        setShowQuantityModal(true);
    };
    const handleQuantityConfirm = (quantity)=>{
        if (!pendingSelection) return;
        const { type, item, category } = pendingSelection;
        const typicalServing = 'typicalServing' in item ? item.typicalServing : 100;
        // Calculate mass in grams
        let massGrams;
        if (quantity.unit === 'grams') {
            massGrams = quantity.amount;
        } else if (quantity.unit === 'percentage') {
            massGrams = quantity.amount / 100 * typicalServing;
        } else {
            massGrams = quantity.amount * typicalServing;
        }
        const newFood = {
            id: `${item.id}-${Date.now()}`,
            type,
            name: item.name,
            category,
            quantity,
            massGrams,
            typicalServing,
            part: type === 'material' && 'part' in item ? item.part : undefined
        };
        setSelectedFoods([
            ...selectedFoods,
            newFood
        ]);
        setPendingSelection(null);
        setShowQuantityModal(false);
    };
    const handleUpdateQuantity = (id, quantity, massGrams)=>{
        setSelectedFoods((foods)=>foods.map((food)=>food.id === id ? {
                    ...food,
                    quantity,
                    massGrams
                } : food));
    };
    const handleRemove = (id)=>{
        setSelectedFoods((foods)=>foods.filter((f)=>f.id !== id));
    };
    const handleClear = ()=>{
        if (confirm('Are you sure you want to clear all foods?')) {
            setSelectedFoods([]);
        }
    };
    const totalMass = selectedFoods.reduce((sum, food)=>sum + food.massGrams, 0);
    const handleCalculate = ()=>{
        if (selectedFoods.length === 0) {
            alert('Please add some foods to your compost pile first!');
            return;
        }
        // Prepare data for calculator
        const foodsForCalculation = selectedFoods.map((food)=>({
                id: food.id,
                type: food.type,
                massGrams: food.massGrams
            }));
        // Calculate results
        const results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nutrient$2d$calculator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateCompostImpact"])(foodsForCalculation);
        setCalculatedResults(results);
        setShowResults(true);
        // Scroll to results
        setTimeout(()=>{
            document.getElementById('results-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-1d42510b69ecb5b" + " " + "site-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/",
                        className: "jsx-1d42510b69ecb5b" + " " + "brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sprout, {}, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            "groundwork",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-1d42510b69ecb5b" + " " + "brand-dot",
                                children: "."
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 130,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/#soil-story",
                        className: "jsx-1d42510b69ecb5b" + " " + "header-link",
                        children: [
                            "Track your composting impact ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-1d42510b69ecb5b",
                                children: "↗"
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 133,
                                columnNumber: 40
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/compost-tracker/page.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    paddingTop: '40px',
                    paddingBottom: '60px'
                },
                className: "jsx-1d42510b69ecb5b",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        style: {
                            padding: '40px 20px',
                            gridTemplateColumns: '1fr'
                        },
                        className: "jsx-1d42510b69ecb5b" + " " + "hero",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-1d42510b69ecb5b",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-1d42510b69ecb5b" + " " + "eyebrow",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-1d42510b69ecb5b"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compost-tracker/page.tsx",
                                            lineNumber: 141,
                                            columnNumber: 15
                                        }, this),
                                        " COMPOST IMPACT TRACKER"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compost-tracker/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    style: {
                                        fontSize: '56px',
                                        maxWidth: '600px'
                                    },
                                    className: "jsx-1d42510b69ecb5b",
                                    children: [
                                        "Track your impact.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                            className: "jsx-1d42510b69ecb5b"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compost-tracker/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                            className: "jsx-1d42510b69ecb5b",
                                            children: "Build better soil."
                                        }, void 0, false, {
                                            fileName: "[project]/app/compost-tracker/page.tsx",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compost-tracker/page.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        maxWidth: '520px'
                                    },
                                    className: "jsx-1d42510b69ecb5b" + " " + "hero-copy",
                                    children: "Select the foods you're composting and see exactly how many nutrients you're returning to the soil. Track your cumulative impact over time."
                                }, void 0, false, {
                                    fileName: "[project]/app/compost-tracker/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compost-tracker/page.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        style: {
                            marginBottom: '32px'
                        },
                        className: "jsx-1d42510b69ecb5b" + " " + "input-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-1d42510b69ecb5b" + " " + "step-label",
                                children: [
                                    "01 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-1d42510b69ecb5b",
                                        children: "SEARCH FOR FOODS"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compost-tracker/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 16
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    marginBottom: '12px'
                                },
                                className: "jsx-1d42510b69ecb5b",
                                children: "What are you composting today?"
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    marginBottom: '20px'
                                },
                                className: "jsx-1d42510b69ecb5b",
                                children: "Search from over 30 common foods and composite meals. Select quantities for each item."
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FoodSearch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                onSelect: handleFoodSelect,
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-1d42510b69ecb5b" + " " + "input-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-1d42510b69ecb5b" + " " + "step-label",
                                children: [
                                    "02 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-1d42510b69ecb5b",
                                        children: "YOUR COMPOST PILE"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compost-tracker/page.tsx",
                                        lineNumber: 171,
                                        columnNumber: 16
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    marginBottom: '12px'
                                },
                                className: "jsx-1d42510b69ecb5b",
                                children: "Items you're composting"
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    marginBottom: '20px'
                                },
                                className: "jsx-1d42510b69ecb5b",
                                children: selectedFoods.length === 0 ? 'Select foods above to start building your compost pile.' : `You've added ${selectedFoods.length} item${selectedFoods.length !== 1 ? 's' : ''} totaling ${Math.round(totalMass)}g of food waste.`
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SelectedFoodsList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                foods: selectedFoods,
                                onUpdateQuantity: handleUpdateQuantity,
                                onRemove: handleRemove,
                                onClear: handleClear
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            selectedFoods.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '24px',
                                    textAlign: 'center'
                                },
                                className: "jsx-1d42510b69ecb5b",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        // TODO: Navigate to calculation results
                                        alert('Calculation feature coming in Task 3!');
                                    },
                                    style: {
                                        display: 'inline-block'
                                    },
                                    className: "jsx-1d42510b69ecb5b" + " " + "primary",
                                    children: [
                                        "Calculate nutrient impact ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            className: "jsx-1d42510b69ecb5b",
                                            children: "↗"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compost-tracker/page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 43
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compost-tracker/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    showQuantityModal && pendingSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>{
                            setShowQuantityModal(false);
                            setPendingSelection(null);
                        },
                        className: "jsx-1d42510b69ecb5b" + " " + "modal-overlay",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: (e)=>e.stopPropagation(),
                            className: "jsx-1d42510b69ecb5b" + " " + "modal-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-1d42510b69ecb5b" + " " + "modal-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "jsx-1d42510b69ecb5b",
                                            children: [
                                                "How much ",
                                                pendingSelection.item.name,
                                                "?"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compost-tracker/page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowQuantityModal(false);
                                                setPendingSelection(null);
                                            },
                                            "aria-label": "Close",
                                            className: "jsx-1d42510b69ecb5b" + " " + "modal-close",
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compost-tracker/page.tsx",
                                            lineNumber: 215,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compost-tracker/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuantityInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    typicalServing: 'typicalServing' in pendingSelection.item ? pendingSelection.item.typicalServing : 100,
                                    onQuantityChange: handleQuantityConfirm
                                }, void 0, false, {
                                    fileName: "[project]/app/compost-tracker/page.tsx",
                                    lineNumber: 226,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compost-tracker/page.tsx",
                            lineNumber: 212,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        style: {
                            marginTop: '48px'
                        },
                        className: "jsx-1d42510b69ecb5b" + " " + "reality",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sprout, {}, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-1d42510b69ecb5b",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "jsx-1d42510b69ecb5b",
                                        children: "How it works:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compost-tracker/page.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    " Search and select foods you're composting, specify quantities, and we'll calculate the nutrients returned to soil based on composting retention rates from EPA research. Data comes from USDA FoodData Central (public domain)."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/compost-tracker/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "jsx-1d42510b69ecb5b",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/",
                        className: "jsx-1d42510b69ecb5b" + " " + "brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sprout, {}, void 0, false, {
                                fileName: "[project]/app/compost-tracker/page.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            "groundwork."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-1d42510b69ecb5b",
                        children: "Food is best eaten. Composting gives unavoidable scraps another purpose."
                    }, void 0, false, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-1d42510b69ecb5b",
                        children: "Small steps. Honest science."
                    }, void 0, false, {
                        fileName: "[project]/app/compost-tracker/page.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/compost-tracker/page.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "1d42510b69ecb5b",
                children: ".modal-overlay.jsx-1d42510b69ecb5b{z-index:1000;background:#263b2d80;justify-content:center;align-items:center;padding:20px;display:flex;position:fixed;inset:0}.modal-content.jsx-1d42510b69ecb5b{background:#fff;border-radius:12px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 12px 48px #263b2d40}.modal-header.jsx-1d42510b69ecb5b{border-bottom:1px solid #eef1e8;justify-content:space-between;align-items:center;padding:24px 24px 16px;display:flex}.modal-header.jsx-1d42510b69ecb5b h3.jsx-1d42510b69ecb5b{margin:0;font-size:18px;font-weight:600}.modal-close.jsx-1d42510b69ecb5b{color:#6a745e;cursor:pointer;background:#f0f2e8;border:none;border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;font-size:16px;transition:all .2s;display:flex}.modal-close.jsx-1d42510b69ecb5b:hover{color:var(--ink);background:#e0e3d8}.modal-content.jsx-1d42510b69ecb5b .quantity-input{border:none;margin:24px;padding:0}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/compost-tracker/page.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/expanded-catalogue.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Expanded Food Database for Composting Impact Calculator
 * 
 * This file contains a comprehensive database of common compostable foods
 * with nutritional composition data sourced from USDA FoodData Central.
 * 
 * Data Version: v2-expanded
 * Last Updated: 2026-10-24
 * 
 * All nutrient values are per 100g fresh weight unless otherwise specified.
 */ __turbopack_context__.s([
    "RETENTION_FACTORS",
    ()=>RETENTION_FACTORS,
    "categories",
    ()=>categories,
    "compositeFoods",
    ()=>compositeFoods,
    "getCompositeFoodById",
    ()=>getCompositeFoodById,
    "getMaterialById",
    ()=>getMaterialById,
    "getMaterialsByCategory",
    ()=>getMaterialsByCategory,
    "materials",
    ()=>materials,
    "searchAll",
    ()=>searchAll,
    "searchCompositeFoods",
    ()=>searchCompositeFoods,
    "searchMaterials",
    ()=>searchMaterials
]);
// Helper function to create a Value object
const v = (value, unit = 'mg/100g', type = 'measured', confidence = 'medium')=>({
        value,
        unit,
        basis: 'fresh',
        type,
        source: 'USDA FoodData Central',
        confidence,
        reuse: 'CC0'
    });
// USDA SR Legacy reference
const USDA_SR = 'https://fdc.nal.usda.gov/';
const RETENTION_FACTORS = {
    nitrogen: 0.70,
    phosphorus: 0.93,
    potassium: 0.85,
    calcium: 0.90,
    magnesium: 0.90,
    sulfur: 0.75,
    iron: 0.95,
    zinc: 0.95,
    water: 1.0,
    organicMatter: 0.50,
    carbon: 0.55
};
const materials = [
    // ===== FRUITS =====
    {
        id: 'banana-flesh',
        name: 'Banana flesh',
        aliases: [
            'banana',
            'bananas'
        ],
        category: 'fruit',
        part: 'flesh',
        preparation: 'raw',
        typicalServing: 118,
        unit: 'g',
        moisture: 0.7491,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(1.09, 'g/100g'),
        minerals: {
            P: v(22),
            K: v(358),
            Ca: v(5),
            Mg: v(27),
            S: v(null),
            Fe: v(0.26),
            Zn: v(0.15)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '09040',
            fdcId: 173944,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'banana-peel',
        name: 'Banana peel',
        aliases: [
            'banana skin',
            'banana peels'
        ],
        category: 'fruit',
        part: 'peel',
        preparation: 'raw',
        typicalServing: 60,
        unit: 'g',
        moisture: null,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(null, 'g/100g', 'assumed'),
        minerals: {
            P: v(null),
            K: v(null),
            Ca: v(null),
            Mg: v(null),
            S: v(null),
            Fe: v(null),
            Zn: v(null)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: null,
            fdcId: null,
            version: 'Pending research',
            publication: 'N/A',
            reuse: 'No composition data yet'
        }
    },
    {
        id: 'apple-flesh',
        name: 'Apple flesh',
        aliases: [
            'apple',
            'apples'
        ],
        category: 'fruit',
        part: 'flesh',
        preparation: 'raw',
        typicalServing: 154,
        unit: 'g',
        moisture: 0.8581,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.27, 'g/100g'),
        minerals: {
            P: v(11),
            K: v(90),
            Ca: v(5),
            Mg: v(4),
            S: v(null),
            Fe: v(0.07),
            Zn: v(0.04)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '09004',
            fdcId: 171689,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'apple-peel',
        name: 'Apple peel',
        aliases: [
            'apple skin',
            'apple peels'
        ],
        category: 'fruit',
        part: 'peel',
        preparation: 'raw',
        typicalServing: 26,
        unit: 'g',
        moisture: null,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(null, 'g/100g', 'assumed'),
        minerals: {
            P: v(null),
            K: v(null),
            Ca: v(null),
            Mg: v(null),
            S: v(null),
            Fe: v(null),
            Zn: v(null)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: null,
            fdcId: null,
            version: 'Pending research',
            publication: 'N/A',
            reuse: 'No composition data yet'
        }
    },
    {
        id: 'apple-core',
        name: 'Apple core',
        aliases: [
            'apple cores'
        ],
        category: 'fruit',
        part: 'core',
        preparation: 'raw',
        typicalServing: 20,
        unit: 'g',
        moisture: null,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(null, 'g/100g', 'assumed'),
        minerals: {
            P: v(null),
            K: v(null),
            Ca: v(null),
            Mg: v(null),
            S: v(null),
            Fe: v(null),
            Zn: v(null)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: null,
            fdcId: null,
            version: 'Pending research',
            publication: 'N/A',
            reuse: 'No composition data yet'
        }
    },
    {
        id: 'orange-flesh',
        name: 'Orange flesh',
        aliases: [
            'orange',
            'oranges'
        ],
        category: 'fruit',
        part: 'flesh',
        preparation: 'raw',
        typicalServing: 131,
        unit: 'g',
        moisture: 0.8675,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.94, 'g/100g'),
        minerals: {
            P: v(14),
            K: v(181),
            Ca: v(40),
            Mg: v(10),
            S: v(null),
            Fe: v(0.10),
            Zn: v(0.07)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '09200',
            fdcId: 169097,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'orange-peel',
        name: 'Orange peel',
        aliases: [
            'orange skin',
            'orange peels'
        ],
        category: 'fruit',
        part: 'peel',
        preparation: 'raw',
        typicalServing: 45,
        unit: 'g',
        moisture: null,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(1.5, 'g/100g', 'proxy', 'low'),
        minerals: {
            P: v(21, 'mg/100g', 'proxy', 'low'),
            K: v(212, 'mg/100g', 'proxy', 'low'),
            Ca: v(161, 'mg/100g', 'proxy', 'low'),
            Mg: v(22, 'mg/100g', 'proxy', 'low'),
            S: v(null),
            Fe: v(0.80, 'mg/100g', 'proxy', 'low'),
            Zn: v(0.25, 'mg/100g', 'proxy', 'low')
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '09216',
            fdcId: null,
            version: 'USDA SR Legacy (compiled estimate)',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'strawberry',
        name: 'Strawberry',
        aliases: [
            'strawberries'
        ],
        category: 'fruit',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 12,
        unit: 'g',
        moisture: 0.9090,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.67, 'g/100g'),
        minerals: {
            P: v(24),
            K: v(153),
            Ca: v(16),
            Mg: v(13),
            S: v(null),
            Fe: v(0.41),
            Zn: v(0.14)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '09316',
            fdcId: 167762,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'tomato',
        name: 'Tomato',
        aliases: [
            'tomatoes'
        ],
        category: 'fruit',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 123,
        unit: 'g',
        moisture: 0.9493,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.88, 'g/100g'),
        minerals: {
            P: v(24),
            K: v(237),
            Ca: v(10),
            Mg: v(11),
            S: v(null),
            Fe: v(0.27),
            Zn: v(0.17)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11529',
            fdcId: 170457,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'watermelon',
        name: 'Watermelon',
        aliases: [
            'watermelons'
        ],
        category: 'fruit',
        part: 'flesh',
        preparation: 'raw',
        typicalServing: 286,
        unit: 'g',
        moisture: 0.9185,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.61, 'g/100g'),
        minerals: {
            P: v(11),
            K: v(112),
            Ca: v(7),
            Mg: v(10),
            S: v(null),
            Fe: v(0.24),
            Zn: v(0.10)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '09326',
            fdcId: 167765,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    // ===== VEGETABLES =====
    {
        id: 'lettuce',
        name: 'Lettuce',
        aliases: [
            'lettuce leaf',
            'lettuce leaves'
        ],
        category: 'vegetable',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 36,
        unit: 'g',
        moisture: 0.9537,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(1.36, 'g/100g'),
        minerals: {
            P: v(29),
            K: v(194),
            Ca: v(36),
            Mg: v(13),
            S: v(null),
            Fe: v(0.86),
            Zn: v(0.18)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11251',
            fdcId: 169248,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'carrot',
        name: 'Carrot',
        aliases: [
            'carrots'
        ],
        category: 'vegetable',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 61,
        unit: 'g',
        moisture: 0.8828,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.93, 'g/100g'),
        minerals: {
            P: v(35),
            K: v(320),
            Ca: v(33),
            Mg: v(12),
            S: v(null),
            Fe: v(0.30),
            Zn: v(0.24)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11124',
            fdcId: 170393,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'potato-flesh',
        name: 'Potato flesh',
        aliases: [
            'potato',
            'potatoes'
        ],
        category: 'vegetable',
        part: 'flesh',
        preparation: 'raw',
        typicalServing: 150,
        unit: 'g',
        moisture: 0.7916,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(2.05, 'g/100g'),
        minerals: {
            P: v(57),
            K: v(425),
            Ca: v(12),
            Mg: v(23),
            S: v(null),
            Fe: v(0.81),
            Zn: v(0.30)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11352',
            fdcId: 170026,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'potato-peel',
        name: 'Potato peel',
        aliases: [
            'potato skin',
            'potato peels'
        ],
        category: 'vegetable',
        part: 'peel',
        preparation: 'raw',
        typicalServing: 20,
        unit: 'g',
        moisture: null,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(null, 'g/100g', 'assumed'),
        minerals: {
            P: v(null),
            K: v(null),
            Ca: v(null),
            Mg: v(null),
            S: v(null),
            Fe: v(null),
            Zn: v(null)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: null,
            fdcId: null,
            version: 'Pending research',
            publication: 'N/A',
            reuse: 'No composition data yet'
        }
    },
    {
        id: 'onion',
        name: 'Onion',
        aliases: [
            'onions'
        ],
        category: 'vegetable',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 110,
        unit: 'g',
        moisture: 0.8917,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(1.10, 'g/100g'),
        minerals: {
            P: v(29),
            K: v(146),
            Ca: v(23),
            Mg: v(10),
            S: v(null),
            Fe: v(0.21),
            Zn: v(0.17)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11282',
            fdcId: 170000,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'broccoli',
        name: 'Broccoli',
        aliases: [
            'broccoli florets'
        ],
        category: 'vegetable',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 91,
        unit: 'g',
        moisture: 0.8929,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(2.82, 'g/100g'),
        minerals: {
            P: v(66),
            K: v(316),
            Ca: v(47),
            Mg: v(21),
            S: v(null),
            Fe: v(0.73),
            Zn: v(0.41)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11090',
            fdcId: 170379,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'cucumber',
        name: 'Cucumber',
        aliases: [
            'cucumbers'
        ],
        category: 'vegetable',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 104,
        unit: 'g',
        moisture: 0.9552,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.65, 'g/100g'),
        minerals: {
            P: v(24),
            K: v(147),
            Ca: v(16),
            Mg: v(13),
            S: v(null),
            Fe: v(0.28),
            Zn: v(0.20)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11205',
            fdcId: 168409,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'bell-pepper',
        name: 'Bell pepper',
        aliases: [
            'pepper',
            'peppers',
            'bell peppers',
            'sweet pepper'
        ],
        category: 'vegetable',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 119,
        unit: 'g',
        moisture: 0.9392,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(0.86, 'g/100g'),
        minerals: {
            P: v(20),
            K: v(175),
            Ca: v(10),
            Mg: v(10),
            S: v(null),
            Fe: v(0.34),
            Zn: v(0.13)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '11821',
            fdcId: 170108,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    // ===== GRAINS =====
    {
        id: 'bread-white',
        name: 'White bread',
        aliases: [
            'bread',
            'white bread'
        ],
        category: 'grain',
        part: 'whole',
        preparation: 'cooked',
        typicalServing: 25,
        unit: 'g',
        moisture: 0.3798,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(7.64, 'g/100g'),
        minerals: {
            P: v(80),
            K: v(100),
            Ca: v(151),
            Mg: v(22),
            S: v(null),
            Fe: v(3.64),
            Zn: v(0.57)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '18069',
            fdcId: 172687,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'rice-cooked',
        name: 'Rice, cooked',
        aliases: [
            'rice',
            'white rice',
            'cooked rice'
        ],
        category: 'grain',
        part: 'whole',
        preparation: 'cooked',
        typicalServing: 158,
        unit: 'g',
        moisture: 0.6895,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(2.69, 'g/100g'),
        minerals: {
            P: v(43),
            K: v(35),
            Ca: v(10),
            Mg: v(12),
            S: v(null),
            Fe: v(1.20),
            Zn: v(0.49)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '20045',
            fdcId: 169757,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'pasta-cooked',
        name: 'Pasta, cooked',
        aliases: [
            'pasta',
            'noodles',
            'spaghetti',
            'cooked pasta'
        ],
        category: 'grain',
        part: 'whole',
        preparation: 'cooked',
        typicalServing: 140,
        unit: 'g',
        moisture: 0.6239,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(5.80, 'g/100g'),
        minerals: {
            P: v(58),
            K: v(44),
            Ca: v(7),
            Mg: v(18),
            S: v(null),
            Fe: v(1.28),
            Zn: v(0.51)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '20121',
            fdcId: 169735,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    // ===== PROTEINS =====
    {
        id: 'egg-whole',
        name: 'Egg, whole',
        aliases: [
            'egg',
            'eggs'
        ],
        category: 'protein',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 50,
        unit: 'g',
        moisture: 0.7628,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(12.56, 'g/100g'),
        minerals: {
            P: v(198),
            K: v(138),
            Ca: v(56),
            Mg: v(12),
            S: v(null),
            Fe: v(1.75),
            Zn: v(1.29)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '01123',
            fdcId: 171287,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'eggshell',
        name: 'Eggshell',
        aliases: [
            'egg shell',
            'eggshells',
            'egg shells'
        ],
        category: 'protein',
        part: 'shell',
        preparation: 'raw',
        typicalServing: 6,
        unit: 'g',
        moisture: 0.02,
        organicMatter: v(3.5, 'g/100g', 'assumed', 'low'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(3.6, 'g/100g', 'assumed', 'low'),
        minerals: {
            P: v(50, 'mg/100g', 'assumed', 'low'),
            K: v(30, 'mg/100g', 'assumed', 'low'),
            Ca: v(37000, 'mg/100g', 'assumed', 'medium'),
            Mg: v(400, 'mg/100g', 'assumed', 'low'),
            S: v(null),
            Fe: v(2, 'mg/100g', 'assumed', 'low'),
            Zn: v(0.5, 'mg/100g', 'assumed', 'low')
        },
        nitrogenFactor: 6.25,
        source: {
            url: 'Scientific literature estimates',
            recordId: null,
            fdcId: null,
            version: 'Project estimates',
            publication: 'N/A',
            reuse: 'project-assumption'
        }
    },
    {
        id: 'chicken-raw',
        name: 'Chicken, raw',
        aliases: [
            'chicken',
            'chicken breast',
            'chicken meat'
        ],
        category: 'protein',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 100,
        unit: 'g',
        moisture: 0.7360,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(23.09, 'g/100g'),
        minerals: {
            P: v(173),
            K: v(256),
            Ca: v(15),
            Mg: v(28),
            S: v(null),
            Fe: v(1.01),
            Zn: v(1.54)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '05062',
            fdcId: 171477,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'ground-beef',
        name: 'Ground beef, raw',
        aliases: [
            'beef',
            'ground beef',
            'hamburger',
            'hamburger meat'
        ],
        category: 'protein',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 100,
        unit: 'g',
        moisture: 0.6403,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(17.17, 'g/100g'),
        minerals: {
            P: v(170),
            K: v(270),
            Ca: v(18),
            Mg: v(18),
            S: v(null),
            Fe: v(2.08),
            Zn: v(4.79)
        },
        nitrogenFactor: 6.25,
        source: {
            url: USDA_SR,
            recordId: '13046',
            fdcId: 174032,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    // ===== DAIRY =====
    {
        id: 'cheese-cheddar',
        name: 'Cheddar cheese',
        aliases: [
            'cheese',
            'cheddar',
            'cheese cheddar'
        ],
        category: 'dairy',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 28,
        unit: 'g',
        moisture: 0.3690,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(24.90, 'g/100g'),
        minerals: {
            P: v(512),
            K: v(98),
            Ca: v(721),
            Mg: v(28),
            S: v(null),
            Fe: v(0.68),
            Zn: v(3.11)
        },
        nitrogenFactor: 6.38,
        source: {
            url: USDA_SR,
            recordId: '01009',
            fdcId: 173419,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    {
        id: 'yogurt',
        name: 'Yogurt, plain',
        aliases: [
            'yogurt',
            'plain yogurt'
        ],
        category: 'dairy',
        part: 'whole',
        preparation: 'raw',
        typicalServing: 245,
        unit: 'g',
        moisture: 0.8790,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(3.47, 'g/100g'),
        minerals: {
            P: v(135),
            K: v(155),
            Ca: v(121),
            Mg: v(12),
            S: v(null),
            Fe: v(0.05),
            Zn: v(0.59)
        },
        nitrogenFactor: 6.38,
        source: {
            url: USDA_SR,
            recordId: '01116',
            fdcId: 170903,
            version: 'USDA SR Legacy',
            publication: '2019-04',
            reuse: 'USDA public domain / CC0'
        }
    },
    // ===== COFFEE GROUNDS =====
    {
        id: 'coffee-grounds',
        name: 'Coffee grounds, used',
        aliases: [
            'coffee grounds',
            'coffee',
            'used coffee grounds'
        ],
        category: 'grain',
        part: 'whole',
        preparation: 'cooked',
        typicalServing: 10,
        unit: 'g',
        moisture: 0.60,
        organicMatter: v(null, 'g/100g'),
        organicCarbon: v(null, 'g/100g'),
        protein: v(2.0, 'g/100g', 'assumed', 'low'),
        minerals: {
            P: v(60, 'mg/100g', 'assumed', 'low'),
            K: v(320, 'mg/100g', 'assumed', 'medium'),
            Ca: v(50, 'mg/100g', 'assumed', 'low'),
            Mg: v(80, 'mg/100g', 'assumed', 'low'),
            S: v(null),
            Fe: v(0.5, 'mg/100g', 'assumed', 'low'),
            Zn: v(0.2, 'mg/100g', 'assumed', 'low')
        },
        nitrogenFactor: 6.25,
        source: {
            url: 'Research literature on coffee grounds composting',
            recordId: null,
            fdcId: null,
            version: 'Literature estimates',
            publication: 'N/A',
            reuse: 'project-assumption'
        }
    }
];
const compositeFoods = [
    {
        id: 'cheeseburger',
        name: 'Cheeseburger',
        category: 'composite',
        typicalServing: 200,
        unit: 'g',
        components: [
            {
                materialId: 'ground-beef',
                percentage: 40
            },
            {
                materialId: 'cheese-cheddar',
                percentage: 10
            },
            {
                materialId: 'bread-white',
                percentage: 35
            },
            {
                materialId: 'lettuce',
                percentage: 7.5
            },
            {
                materialId: 'tomato',
                percentage: 7.5
            }
        ]
    },
    {
        id: 'salad',
        name: 'Mixed salad',
        category: 'composite',
        typicalServing: 150,
        unit: 'g',
        components: [
            {
                materialId: 'lettuce',
                percentage: 60
            },
            {
                materialId: 'tomato',
                percentage: 20
            },
            {
                materialId: 'cucumber',
                percentage: 10
            },
            {
                materialId: 'carrot',
                percentage: 10
            }
        ]
    },
    {
        id: 'fruit-salad',
        name: 'Fruit salad',
        category: 'composite',
        typicalServing: 200,
        unit: 'g',
        components: [
            {
                materialId: 'banana-flesh',
                percentage: 25
            },
            {
                materialId: 'apple-flesh',
                percentage: 25
            },
            {
                materialId: 'orange-flesh',
                percentage: 25
            },
            {
                materialId: 'strawberry',
                percentage: 25
            }
        ]
    },
    {
        id: 'sandwich',
        name: 'Sandwich',
        category: 'composite',
        typicalServing: 150,
        unit: 'g',
        components: [
            {
                materialId: 'bread-white',
                percentage: 50
            },
            {
                materialId: 'cheese-cheddar',
                percentage: 15
            },
            {
                materialId: 'lettuce',
                percentage: 15
            },
            {
                materialId: 'tomato',
                percentage: 20
            }
        ]
    }
];
const categories = {
    fruit: {
        name: 'Fruits',
        icon: '🍎',
        description: 'Fruits and fruit scraps'
    },
    vegetable: {
        name: 'Vegetables',
        icon: '🥕',
        description: 'Vegetables and vegetable scraps'
    },
    grain: {
        name: 'Grains & Bread',
        icon: '🍞',
        description: 'Breads, pasta, rice, and grains'
    },
    protein: {
        name: 'Proteins',
        icon: '🥩',
        description: 'Meat, eggs, and protein sources'
    },
    dairy: {
        name: 'Dairy',
        icon: '🧀',
        description: 'Cheese, yogurt, and dairy products'
    },
    composite: {
        name: 'Mixed Foods',
        icon: '🍔',
        description: 'Common meals and composite foods'
    }
};
function getMaterialById(id) {
    return materials.find((m)=>m.id === id);
}
function getCompositeFoodById(id) {
    return compositeFoods.find((cf)=>cf.id === id);
}
function searchMaterials(query) {
    const lowerQuery = query.toLowerCase();
    return materials.filter((m)=>m.name.toLowerCase().includes(lowerQuery) || m.aliases.some((alias)=>alias.toLowerCase().includes(lowerQuery)));
}
function searchCompositeFoods(query) {
    const lowerQuery = query.toLowerCase();
    return compositeFoods.filter((cf)=>cf.name.toLowerCase().includes(lowerQuery));
}
function searchAll(query) {
    return [
        ...searchMaterials(query),
        ...searchCompositeFoods(query)
    ];
}
function getMaterialsByCategory(category) {
    return materials.filter((m)=>m.category === category);
}
}),
"[project]/lib/nutrient-calculator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateCompostImpact",
    ()=>calculateCompostImpact,
    "formatMass",
    ()=>formatMass,
    "getNutrientDescription",
    ()=>getNutrientDescription,
    "getNutrientName",
    ()=>getNutrientName,
    "getRetentionPercentage",
    ()=>getRetentionPercentage
]);
/**
 * Nutrient Calculator for Composting Impact
 * 
 * Integrates the expanded food catalogue with calculation engine
 * to compute nutrient returns from composted food waste.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/expanded-catalogue.ts [app-ssr] (ecmascript)");
;
const elements = [
    'N',
    'P',
    'K',
    'Ca',
    'Mg',
    'S',
    'Fe',
    'Zn'
];
/**
 * Convert concentration from Value to grams per gram fresh weight
 */ function freshGrams(value, unit, basis, moisture) {
    if (value === null) return null;
    // Convert to g/g
    const amount = value * (unit === 'mg/100g' ? 0.001 : 1) / 100;
    // Apply moisture correction for dry basis
    if (basis === 'fresh') {
        return amount;
    } else {
        // dry basis: need moisture to convert
        if (moisture === null) return null;
        return amount * (1 - moisture);
    }
}
/**
 * Calculate nutrient concentration for a material
 */ function getConcentration(material, element) {
    if (element === 'N') {
        // Nitrogen derived from protein
        const proteinConc = freshGrams(material.protein.value, material.protein.unit, material.protein.basis, material.moisture);
        if (proteinConc === null) return null;
        return proteinConc / material.nitrogenFactor;
    } else {
        // Other minerals
        const mineral = material.minerals[element];
        return freshGrams(mineral.value, mineral.unit, mineral.basis, material.moisture);
    }
}
/**
 * Calculate returned amount after composting
 */ function calculateReturned(mass, concentration, retention, applied) {
    if (!Number.isFinite(mass) || mass <= 0) {
        throw new Error('Invalid mass');
    }
    if (!Number.isFinite(applied) || applied < 0 || applied > 1) {
        throw new Error('Invalid applied fraction');
    }
    if (!Number.isFinite(retention) || retention < 0 || retention > 1) {
        throw new Error('Invalid retention factor');
    }
    if (concentration === null) return null;
    return mass * concentration * retention * applied;
}
/**
 * Calculate nutrients for a single material
 */ function calculateMaterial(material, mass, appliedFraction = 1.0) {
    const nutrients = {};
    const inputNutrients = {};
    for (const element of elements){
        const concentration = getConcentration(material, element);
        // Input nutrients (before composting)
        inputNutrients[element] = concentration === null ? null : mass * concentration;
        // Returned nutrients (after composting with retention)
        const elementKey = element === 'N' ? 'nitrogen' : element === 'P' ? 'phosphorus' : element === 'K' ? 'potassium' : element === 'Ca' ? 'calcium' : element === 'Mg' ? 'magnesium' : element === 'S' ? 'sulfur' : element === 'Fe' ? 'iron' : 'zinc';
        const retention = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RETENTION_FACTORS"][elementKey];
        nutrients[element] = calculateReturned(mass, concentration, retention, appliedFraction);
    }
    return {
        materialId: material.id,
        materialName: material.name,
        mass,
        nutrients,
        inputNutrients
    };
}
/**
 * Calculate nutrients for a composite food (breaks down into components)
 */ function calculateComposite(composite, mass, appliedFraction = 1.0) {
    const results = [];
    for (const component of composite.components){
        const material = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaterialById"])(component.materialId);
        if (!material) {
            console.warn(`Material ${component.materialId} not found for composite ${composite.id}`);
            continue;
        }
        const componentMass = mass * component.percentage / 100;
        const result = calculateMaterial(material, componentMass, appliedFraction);
        results.push(result);
    }
    return results;
}
/**
 * Sum nutrient values across components
 */ function sumNutrients(components, key) {
    const totals = {};
    for (const element of elements){
        const values = components.map((c)=>c[key][element]);
        // If any component is null, the total is null
        if (values.some((v)=>v === null)) {
            totals[element] = null;
        } else {
            totals[element] = values.reduce((sum, v)=>sum + (v || 0), 0);
        }
    }
    return totals;
}
/**
 * Calculate total water content (sum of moisture in all foods)
 */ function calculateWaterContent(components) {
    let totalWater = 0;
    for (const component of components){
        const material = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaterialById"])(component.materialId);
        if (!material || material.moisture === null) {
            return null; // Can't calculate if any moisture is unknown
        }
        totalWater += component.mass * material.moisture;
    }
    return totalWater;
}
function calculateCompostImpact(foods, appliedFraction = 1.0) {
    const allComponents = [];
    const missingDataItems = [];
    let totalInputMass = 0;
    // Process each food
    for (const food of foods){
        totalInputMass += food.massGrams;
        if (food.type === 'material') {
            const material = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaterialById"])(food.id.split('-').slice(0, -1).join('-')); // Remove timestamp
            if (!material) {
                console.warn(`Material ${food.id} not found`);
                continue;
            }
            // Check if material has data
            if (material.protein.value === null || material.minerals.P.value === null || material.minerals.K.value === null) {
                missingDataItems.push(material.name);
            }
            const result = calculateMaterial(material, food.massGrams, appliedFraction);
            allComponents.push(result);
        } else if (food.type === 'composite') {
            const composite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompositeFoodById"])(food.id.split('-').slice(0, -1).join('-'));
            if (!composite) {
                console.warn(`Composite ${food.id} not found`);
                continue;
            }
            const results = calculateComposite(composite, food.massGrams, appliedFraction);
            // Check for missing data in components
            for (const result of results){
                const material = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaterialById"])(result.materialId);
                if (material && (material.protein.value === null || material.minerals.P.value === null || material.minerals.K.value === null)) {
                    if (!missingDataItems.includes(material.name)) {
                        missingDataItems.push(material.name);
                    }
                }
            }
            allComponents.push(...results);
        }
    }
    // Calculate totals
    const nutrients = sumNutrients(allComponents, 'nutrients');
    const inputNutrients = sumNutrients(allComponents, 'inputNutrients');
    const waterContent = calculateWaterContent(allComponents);
    // Organic matter and carbon (placeholder - need proper data)
    const organicMatter = null; // TODO: Calculate when data available
    const carbon = null; // TODO: Calculate when data available
    const hasUnknownData = missingDataItems.length > 0 || Object.values(nutrients).some((v)=>v === null);
    return {
        nutrients,
        inputNutrients,
        organicMatter,
        carbon,
        waterContent,
        components: allComponents,
        totalInputMass,
        hasUnknownData,
        missingDataItems
    };
}
function formatMass(grams, precision = 2) {
    if (grams === null) return 'Not yet quantified';
    if (grams === 0) return '0 mg';
    if (grams < 0.001) {
        return `~${(grams * 1_000_000).toPrecision(precision)} µg`;
    } else if (grams < 1) {
        return `~${(grams * 1000).toPrecision(precision)} mg`;
    } else if (grams < 1000) {
        return `~${grams.toPrecision(precision)} g`;
    } else {
        return `~${(grams / 1000).toPrecision(precision)} kg`;
    }
}
function getNutrientName(element) {
    const names = {
        N: 'Nitrogen',
        P: 'Phosphorus',
        K: 'Potassium',
        Ca: 'Calcium',
        Mg: 'Magnesium',
        S: 'Sulfur',
        Fe: 'Iron',
        Zn: 'Zinc'
    };
    return names[element];
}
function getNutrientDescription(element) {
    const descriptions = {
        N: 'Essential for plant growth and green leafy development. Promotes healthy stems and leaves.',
        P: 'Supports root development, flowering, and fruiting. Key for energy transfer in plants.',
        K: 'Regulates water uptake and strengthens plant resistance to disease and stress.',
        Ca: 'Builds strong cell walls and supports root growth. Helps prevent blossom end rot.',
        Mg: 'Central component of chlorophyll. Essential for photosynthesis and enzyme function.',
        S: 'Important for protein synthesis and enzyme function. Contributes to plant vigor.',
        Fe: 'Crucial for chlorophyll production. Prevents yellowing of leaves (chlorosis).',
        Zn: 'Activates plant enzymes and supports growth hormone production.'
    };
    return descriptions[element];
}
function getRetentionPercentage(element) {
    const elementKey = element === 'N' ? 'nitrogen' : element === 'P' ? 'phosphorus' : element === 'K' ? 'potassium' : element === 'Ca' ? 'calcium' : element === 'Mg' ? 'magnesium' : element === 'S' ? 'sulfur' : element === 'Fe' ? 'iron' : 'zinc';
    return Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$expanded$2d$catalogue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RETENTION_FACTORS"][elementKey] * 100);
}
}),
];})()

//# sourceMappingURL=_12qcs8wps208f._.js.map