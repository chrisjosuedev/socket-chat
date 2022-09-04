const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    unit_price: {
        type: Number,
        default: 0.0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true,
    },
    description: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    img: {
        type: String
    }
});

ProductSchema.methods.toJSON = function () {
    const { __v, status, ...product } = this.toObject();
    return product;
};

module.exports = model('Product', ProductSchema);
