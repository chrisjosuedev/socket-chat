const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
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
});

CategorySchema.methods.toJSON = function () {
    const { __v, status, ...category } = this.toObject();
    return category;
};

module.exports = model('Category', CategorySchema);
