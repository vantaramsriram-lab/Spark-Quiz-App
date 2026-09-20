import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchResults();
  }, [search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/results', { params: { search } });
      setResults(res.data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPercentage = (score, total) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'percentage-high') {
      return (
        getPercentage(b.score, b.totalQuestions) -
        getPercentage(a.score, a.totalQuestions)
      );
    }

    if (sortBy === 'percentage-low') {
      return (
        getPercentage(a.score, a.totalQuestions) -
        getPercentage(b.score, b.totalQuestions)
      );
    }

    // if (sortBy === 'score') {
    //   return b.score - a.score;
    // }

    // if (sortBy === 'score-low') {
    //   return a.score - b.score;
    // }

    return 0;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-bold text-[#f1f7fa] mb-1">
            Results
          </h2>
          <p className="text-[#8295a1] text-base">
            {results.length} submissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-56 px-4 py-2.5 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] focus:outline-none focus:border-[#00aeef] text-sm"
          >
            <option value="">Sort By</option>
            <option value="percentage-high">
              Percentage: High-Low
            </option>
            <option value="percentage-low">
              Percentage: Low-High
            </option>
          </select>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-12 text-center">
          <span className="text-4xl mb-4 block">📋</span>
          <p className="text-[#8295a1]">No quiz submissions yet</p>
        </div>
      ) : (
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl overflow-hidden">

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#172936]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">
                    Percentage
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">
                    Time Taken
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">
                    Started
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">
                    Submitted
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedResults.map((result) => (
                  <tr
                    key={result._id}
                    className="border-b border-[#172936]/50 hover:bg-[#050e17] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-[#f1f7fa] font-medium">
                        {result.userName}
                      </div>
                      <div className="text-[#8295a1] text-xs">
                        {result.userEmail}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[#f1f7fa] font-semibold">
                        {result.score}/{result.totalQuestions}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPercentage(
                          result.score,
                          result.totalQuestions
                        ) >= 70
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : getPercentage(
                              result.score,
                              result.totalQuestions
                            ) >= 40
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                      >
                        {getPercentage(
                          result.score,
                          result.totalQuestions
                        )}
                        %
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[#8295a1] text-sm">
                      {formatTime(result.timeTaken)}
                    </td>

                    <td className="px-6 py-4 text-[#8295a1] text-sm">
                      {new Date(result.startedAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-[#8295a1] text-sm">
                      {new Date(result.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-[#172936]/50">
            {sortedResults.map((result) => (
              <div key={result._id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[#f1f7fa] font-medium">
                      {result.userName}
                    </div>
                    <div className="text-[#8295a1] text-sm">
                      {result.userEmail}
                    </div>
                  </div>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPercentage(
                      result.score,
                      result.totalQuestions
                    ) >= 70
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : getPercentage(
                          result.score,
                          result.totalQuestions
                        ) >= 40
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                  >
                    {getPercentage(
                      result.score,
                      result.totalQuestions
                    )}
                    %
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-[#8295a1] text-xs mb-1">
                      Score
                    </div>
                    <div className="text-[#f1f7fa] font-semibold">
                      {result.score}/{result.totalQuestions}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#8295a1] text-xs mb-1">
                      Time
                    </div>
                    <div className="text-[#f1f7fa]">
                      {formatTime(result.timeTaken)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#8295a1] text-xs mb-1">
                      Started
                    </div>
                    <div className="text-[#f1f7fa] text-xs">
                      {new Date(result.startedAt).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#8295a1] text-xs mb-1">
                      Submitted
                    </div>
                    <div className="text-[#f1f7fa] text-xs">
                      {new Date(result.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminResults;


