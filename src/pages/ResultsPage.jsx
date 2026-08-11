import React, { useEffect, useState } from 'react';
import { resultsApi } from '../services/resultsApi';
import { Card } from '../components/common/Card';
import { Trophy, Award, Sparkles, Medal, Loader2, Calendar } from 'lucide-react';

export const ResultsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await resultsApi.getPublicResults();
        setData(res);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading hackathon leaderboard...</p>
      </div>
    );
  }

  const results = data?.results || [];
  const declared = data?.declared && results.length > 0;

  const firstPlace = results.find((r) => r.trophy === 'gold' || r.position.includes('1st'));
  const secondPlace = results.find((r) => r.trophy === 'silver' || r.position.includes('2nd'));
  const thirdPlace = results.find((r) => r.trophy === 'bronze' || r.position.includes('3rd'));
  const consolationList = results.filter((r) => r.trophy === 'consolation' || r.position.includes('Consolation'));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-extrabold uppercase tracking-widest">
          <Trophy className="w-4 h-4" /> Official Leaderboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Hackathon Champions & Winners
        </h1>
        <p className="text-sm text-slate-400">
          Recognizing outstanding technical innovation and engineering excellence in StackHack 2.0.
        </p>
      </div>

      {!declared ? (
        /* Empty State: Results Not Declared Yet */
        <Card className="max-w-md mx-auto text-center py-12 px-6">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Results Will Be Announced Soon!</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Submissions are currently under rigorous evaluation by our judging panel. Check back after the scheduled results announcement time.
          </p>
        </Card>
      ) : (
        /* Leaderboard Podium Display */
        <div className="space-y-10">
          {/* 1st Place Podium Hero Card */}
          {firstPlace && (
            <div className="relative bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-8 text-center shadow-2xl shadow-amber-500/10 max-w-2xl mx-auto overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                <Trophy className="w-10 h-10" />
              </div>
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40">
                ★ 1ST PLACE WINNER ★
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-3">{firstPlace.name}</h2>
              <p className="text-xs font-mono text-amber-400 mt-1">ID: {firstPlace.submissionId}</p>

              {firstPlace.projectTitle && (
                <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-amber-500/30 text-xs text-slate-200 inline-block font-medium">
                  Project: "{firstPlace.projectTitle}"
                </div>
              )}
            </div>
          )}

          {/* 2nd & 3rd Place Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 2nd Place Silver */}
            {secondPlace && (
              <Card className="bg-gradient-to-b from-slate-800/80 via-slate-900 to-slate-950 border-slate-400/40 text-center py-6">
                <div className="w-14 h-14 bg-slate-300/20 text-slate-200 border border-slate-400/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Medal className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider bg-slate-700/50 px-2.5 py-0.5 rounded-full">
                  2ND PLACE
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{secondPlace.name}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {secondPlace.submissionId}</p>
              </Card>
            )}

            {/* 3rd Place Bronze */}
            {thirdPlace && (
              <Card className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-700/40 text-center py-6">
                <div className="w-14 h-14 bg-amber-700/20 text-amber-500 border border-amber-700/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                  3RD PLACE
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{thirdPlace.name}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {thirdPlace.submissionId}</p>
              </Card>
            )}
          </div>

          {/* Consolation Winners List */}
          {consolationList.length > 0 && (
            <Card title="Consolation Award Winners" subtitle="Honorable mentions for outstanding craftsmanship">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {consolationList.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-orange-400 font-bold uppercase block">
                      Consolation Winner
                    </span>
                    <h5 className="text-sm font-semibold text-slate-200">{item.name}</h5>
                    <p className="text-xs font-mono text-slate-500">{item.submissionId}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
