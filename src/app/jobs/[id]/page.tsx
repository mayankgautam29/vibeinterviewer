// app/jobs/[id]/page.tsx

import { connect } from "@/dbconfig/dbconfig";
import Job from "@/models/jobModel";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export default async function JobPage({ params }: Props) {
  const jobId = params.id;

  await connect();
  const job = await Job.findById(jobId)
    .populate("jobByUser", "username profileImg")
    .populate("applicants", "username profileImg");

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{job.jobtitle}</h1>
      <p className="text-gray-600">{job.company}</p>
      <p className="mt-2">{job.jobdescription}</p>
      <div className="mt-4">
        Posted by: {job.jobByUser?.username}
        <img
          src={job.jobByUser?.profileImg}
          className="w-6 h-6 rounded-full inline-block ml-2"
        />
      </div>
      <Link href={`/jobs/${job._id}/interview`}>Apply Here</Link>
      <div>
        {job.applicants?.length > 0 && (
          <div className="mt-2 text-sm text-blue-500">
            Applicants: {job.applicants.length}
          </div>
        )}
      </div>
    </div>
  );
}
