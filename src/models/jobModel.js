import mongoose,{Schema} from "mongoose";
import "@/models/userModel";
const jobSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
        required: true
    },
    jobdescription: {
        type: String,
        required: true
    },
    jobByUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    applicants: [
        {type: Schema.Types.ObjectId,ref: "User"}
    ]
})
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema)
export default Job;