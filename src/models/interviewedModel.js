import mongoose,{Schema} from "mongoose";
const interviewModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    jobId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Job"
    },
    interviewSummary: {
        type: String
    },
    interviewScore: {
        type: Number
    }
})
const Interview = mongoose.models.Interview || mongoose.model("Job",interviewModel)
export default Interview;