import { File, Database, Columns, CircleCheckBig, CirclePlay, Zap, Download, FileText, Grid, Layout } from "lucide-react";

function ReadyToAnalyze({ setAnalyzed }) {
    return (
        <div className="flex flex-col items-center mt-6">
            <div className="flex items-center justify-center mb-3">
                {/* Play icon */}
                <CirclePlay className="w-15 h-15 text-[#7A6FF0]" />
            </div>
            <div className="text-2xl font-semibold text-white mb-3">
                Ready to Analyze
            </div>
            <div className="text-[#a1a8b3] mb-6">
                Your files have been uploaded successfully. Click the button below to
                start the analysis.
            </div>
            <button className="flex bg-[#7A6FF0] hover:bg-[#5e54c7] text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition cursor-pointer"
                onClick={() => setAnalyzed(true)}>
                <Zap className="mr-2" />View Result
            </button>
        </div>
    )
}

export default ReadyToAnalyze