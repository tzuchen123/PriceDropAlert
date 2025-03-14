const siteConfigs = [
    // 完成
    {
        name: "URBAN RESEARCH TW",
        urlPattern: "https://www.urban-research.tw/",
        crawler: "axios", // 預設使用 axios
        selectors: {
            product_name: ".itemName",
            brand_name: ".brandeName a",
            original_price: ".productPrice:first .priceBefore",
            sale_price: ".productPrice:first .priceAfter",
            normal_price: ".productPrice:first .normalPrice_two"
        }
    },
    // 完成
    {
        name: "URBAN RESEARCH JP",
        urlPattern: "https://www.urban-research.jp/",
        crawler: "puppeteer",
        selectors: {
            product_name: ".dtl-Product_Title",
            brand_name: ".dtl-Product_ShopName dd a",
            original_price: ".dtl-Product_Price .price_BeforePrice",
            sale_price: ".dtl-Product_Price .price.is-pricedown",
            normal_price: ".dtl-Product_Price .price:not(.is-pricedown):not(.price_BeforePrice)"
        }
    },
    {
        name: "UNITED ARROWS TW",
        urlPattern: "https://store.united-arrows.tw/",
        crawler: "axios", // 預設使用 axios
        selectors: {
            product_name: ".title",
            brand_name: ".brand-link",
            original_price: ".was-price",
            sale_price: ".new-price"
        }
    },
    {
        name: "UNITED ARROWS JP",
        urlPattern: "https://store.united-arrows.co.jp/",
        crawler: "axios", // 預設使用 axios
        selectors: {
            product_name: ".title",
            brand_name: ".brand-link",
            original_price: ".was-price",
            sale_price: ".new-price"
        }
    },
    // 完成
    {
        name: "dot st TW",
        urlPattern: "https://www.dot-st.tw/",
        crawler: "puppeteer",
        selectors: {
            product_name: ".salepage-title",
            original_price: ".salepage-suggestprice",
            sale_price: ".salepage-price span",
        }
    },
    {
        name: "dot st JP",
        urlPattern: "https://www.dot-st.com/",
        crawler: "puppeteer", // 預設使用 axios
        selectors: {
            product_name: ".item-name",
            brand_name: ".item-detail-brand dd",
            original_price: ".productPrice:first .priceBefore, #code-default .item-original-price",
            sale_price: ".productPrice:first .priceAfter, #code-default .item-price-off",
            normal_price: ".productPrice:first .normalPrice_two, #code-default .item-price"
        }
    },
    // 完成
    {
        name: "VORIAGH",
        urlPattern: "https://en.voriagh.com/",
        crawler: "axios",
        selectors: {
            product_name: ".page-title .base",
            normal_price: ".price-wrapper .price"
        }
    }
];

function getSiteConfig(url) {
    return siteConfigs.find(config => url.includes(config.urlPattern));
}

module.exports = { getSiteConfig };
