import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/auth/authApi";
import toast from "react-hot-toast";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const phone = location.state?.phone

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);

  const inputRefs = useRef([]);

  // Countdown
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Input Change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasted)) return;

    const values = pasted.split("");

    setOtp(values);

    values.forEach((v, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = v;
      }
    });

    inputRefs.current[5].focus();
  };

  // Verify
  const handleSubmit = async (e) => {
  e.preventDefault();

  const finalOtp = otp.join("");

  if (finalOtp.length !== 6) {
    return toast.error("Enter complete OTP");
  }

  try {

    const res = await verifyOtp({
      phone,
      otp: finalOtp,
    });

    toast.success(res.message);

    navigate("/login");

  } catch (error) {

    toast.error(
      error.response?.data?.message || "OTP Verification Failed"
    );

  }
};

  // Resend
  const handleResend = () => {
    setTimeLeft(30);

    // Resend OTP API
    console.log("OTP Resent");
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h1 className="text-center text-3xl font-bold text-white">
        Verify OTP
      </h1>

      <p className="mt-2 text-center text-gray-400">
        Enter the 6 digit OTP
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10"
      >
        <div
          className="flex justify-center gap-3"
          onPaste={handlePaste}
        >
          {otp.map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              maxLength={1}
              value={otp[index]}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="h-14 w-14 rounded-xl border border-gray-700 bg-neutral-900 text-center text-2xl font-bold text-white outline-none transition focus:border-blue-500"
            />
          ))}
        </div>

        <button
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Verify OTP
        </button>
      </form>

      <div className="mt-6 text-center">

        {timeLeft > 0 ? (
          <p className="text-gray-400">
            Resend OTP in{" "}
            <span className="font-semibold text-blue-500">
              {timeLeft}s
            </span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="font-semibold text-blue-500 hover:underline"
          >
            Resend OTP
          </button>
        )}

      </div>

      <button
        onClick={() => navigate("/register")}
        className="mt-6 w-full text-gray-400 transition hover:text-white"
      >
        ← Back to Register
      </button>

    </div>
  );
};

export default OtpPage;