import { useAuth } from '../context/AuthContext';

const QuizCompleted = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030910] p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#00aeef] opacity-5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#21b9ef] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md w-full animate-slideUp">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#00aeef]/20 to-[#21b9ef]/20 border-2 border-[#00aeef]/30 rounded-full mb-4 animate-scaleIn">
            <svg
              className="w-12 h-12 text-[#00aeef]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 100,
                  animation: 'checkmark 0.8s ease-out 0.3s forwards',
                  strokeDashoffset: 100,
                }}
              />
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-8 sm:p-10 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f1f7fa] mb-4">
            Quiz Completed
          </h1>
          
          <div className="w-16 h-1 bg-gradient-to-r from-[#00aeef] to-[#21b9ef] rounded-full mx-auto mb-6"></div>

          <p className="text-[#8295a1] text-lg mb-2">
            Thank you, <span className="text-[#f1f7fa] font-medium">{user?.name}</span>!
          </p>
          
          <p className="text-[#8295a1] mb-8">
            Your quiz has been successfully submitted.
          </p>

          <div className="bg-[#050e17] border border-[#172936] rounded-xl p-4">
            <p className="text-sm text-[#8295a1]">
              You may now close this page.
            </p>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#00aeef] rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-[#00aeef] rounded-full opacity-40"></div>
          <div className="w-2 h-2 bg-[#00aeef] rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizCompleted;
