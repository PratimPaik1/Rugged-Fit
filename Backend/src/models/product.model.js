import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["apparel", "supplements", "equipment", "accessories"],
        default: "apparel"
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "INR"],
            default: "INR"
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: Number,
            },
            sellingPrice: {
                type: Number,
            }
        },

    ]
}, { timestamps: true })


productSchema.index({ 
    title: 'text', 
    description: 'text', 
    category: 'text' 
}, {
    weights: {
        title: 10,
        category: 5,
        description: 1
    },
    name: "TextIndex"
});

const productModel = mongoose.model('product', productSchema);

export default productModel;