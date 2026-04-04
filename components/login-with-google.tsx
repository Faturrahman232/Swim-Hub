// components/LoginWithGoogle.tsx
import Image from "next/image";

export default function LoginWithGoogle() {
  const loginWithGoogle = () => {
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/api/auth/google/callback"
    );
    const scope = encodeURIComponent("profile email");
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={loginWithGoogle}
      className="w-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
    >
      <svg
        className="h-5 w-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-0.5 0 48 48"
      >
        <path
          fill="#FBBC05"
          d="M9.827,24c0-1.524,0.253-2.985,0.705-4.356L2.623,13.604C1.082,16.734,0.214,20.26,0.214,24
            c0,3.737,0.868,7.261,2.407,10.388l7.905-6.051C10.077,26.973,9.827,25.517,9.827,24"
        />
        <path
          fill="#EB4335"
          d="M23.714,10.133c3.311,0,6.302,1.174,8.652,3.093L39.202,6.4c-4.166-3.627-9.507-5.867-15.489-5.867
            c-9.287,0-17.268,5.311-21.09,13.071l7.909,6.039C12.355,14.112,17.549,10.133,23.714,10.133"
        />
        <path
          fill="#34A853"
          d="M23.714,37.867c-6.164,0-11.359-3.979-13.181-9.511l-7.909,6.038c3.822,7.761,11.803,13.072,21.09,13.072
            c5.732,0,11.205-2.035,15.311-5.848l-7.508-5.804C29.4,37.149,26.732,37.867,23.714,37.867"
        />
        <path
          fill="#4285F4"
          d="M46.145,24c0-1.387-0.213-2.88-0.534-4.267H23.714V28.8h12.605c-0.63,3.091-2.345,5.468-4.8,7.014
            l7.508,5.804C43.339,37.614,46.145,31.649,46.145,24"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
}
