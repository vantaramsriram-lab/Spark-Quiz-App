import { useState, useEffect } from 'react';
import api from '../services/api';

const emptyForm = {
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: '',
};

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm(prev => ({ ...prev, options: newOptions }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.questionText.trim()) {
      setError('Question text is required');
      return;
    }

    if (form.options.some(opt => !opt.trim())) {
      setError('All options are required');
      return;
    }

    if (!form.correctAnswer) {
      setError('Please select the correct answer');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, form);
        setSuccess('Question updated successfully');
      } else {
        await api.post('/questions', form);
        setSuccess('Question added successfully');
      }
      setForm({ ...emptyForm });
      setShowForm(false);
      setEditingId(null);
      fetchQuestions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (question) => {
    setForm({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    });
    setEditingId(question._id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/questions/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
      setDeleteConfirm(null);
      setSuccess('Question deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const cancelForm = () => {
    setForm({ ...emptyForm });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-bold text-[#f1f7fa] mb-1">Questions</h2>
          <p className="text-[#8295a1] text-base">{questions.length} questions total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm }); }}
          className="px-4 py-2.5 bg-[#00aeef] hover:bg-[#21b9ef] text-[#031018] rounded-lg font-semibold text-sm transition-all"
        >
          + Add Question
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm animate-fadeIn">
          {success}
        </div>
      )}

      {/* Question Form */}
      {showForm && (
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-6 mb-6 animate-slideUp">
          <h3 className="text-lg font-semibold text-[#f1f7fa] mb-4">
            {editingId ? 'Edit Question' : 'Add New Question'}
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f1f7fa] mb-2">Question</label>
              <textarea
                value={form.questionText}
                onChange={(e) => handleChange('questionText', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all resize-none"
                placeholder="Enter your question..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.options.map((option, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-[#f1f7fa] mb-2">
                    Option {String.fromCharCode(65 + index)}
                  </label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full px-4 py-3 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f1f7fa] mb-2">Correct Answer</label>
              <select
                value={form.correctAnswer}
                onChange={(e) => handleChange('correctAnswer', e.target.value)}
                className="w-full px-4 py-3 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all"
              >
                <option value="">Select correct answer</option>
                {form.options.map((option, index) => (
                  option.trim() && (
                    <option key={index} value={option}>
                      Option {String.fromCharCode(65 + index)}: {option}
                    </option>
                  )
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#00aeef] hover:bg-[#21b9ef] text-[#031018] rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Question' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="px-6 py-2.5 bg-[#172936] hover:bg-[#315568] text-[#f1f7fa] rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-12 text-center">
          <span className="text-4xl mb-4 block">❓</span>
          <p className="text-[#8295a1] mb-2">No questions yet</p>
          <p className="text-[#8295a1] text-sm">Add your first question to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question._id} className="bg-[#08131d] border border-[#172936] rounded-2xl p-6 hover:border-[#315568] transition-all animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#00aeef]/10 border border-[#00aeef]/30 rounded-lg flex items-center justify-center text-[#00aeef] text-sm font-bold">
                    {index + 1}
                  </span>
                  <h4 className="text-[#f1f7fa] font-medium pt-1">{question.questionText}</h4>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(question)}
                    className="px-3 py-1.5 bg-[#172936] hover:bg-[#315568] text-[#f1f7fa] rounded-lg text-xs font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(question._id)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-11">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      option === question.correctAnswer
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-[#050e17] border border-[#172936] text-[#8295a1]'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                    <span>{option}</span>
                    {option === question.correctAnswer && <span className="ml-auto text-xs">✓</span>}
                  </div>
                ))}
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === question._id && (
                <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-fadeIn">
                  <p className="text-sm text-[#f1f7fa] mb-3">Are you sure you want to delete this question?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-[#172936] hover:bg-[#315568] text-[#f1f7fa] rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
