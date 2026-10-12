const shortnerSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectUrl: {
        type: String,
        required: true,
    },
    history: {
        type: [
            {
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                ipAddress: {
                    type: String,
                    required: true,
                },
                userAgent: {
                    type: String,
                    required: true,
                },
            },
        ],
        default: [],
    },
}, { timestamps: true });

const Shortner = mongoose.model('Shortner', shortnerSchema);