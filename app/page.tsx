'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EnterpriseAccessForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', workEmail: '', companyName: '', role: '',
    companyType: '', capacity: '', timeline: '', workload: '', region: '', nda: ''
  })
  
  const [agreements, setAgreements] = useState({
    chk1: false, chk2: false, chk3: false, chk4: false, chk5: false
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isBusinessEmail = (email) => {
    if (!email) return false;
    const lowerEmail = email.toLowerCase();
    const blockedDomains = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@outlook.com'];
    return !blockedDomains.some(domain => lowerEmail.includes(domain)) && lowerEmail.includes('@') && lowerEmail.includes('.');
  }

  const isStep1Valid = Object.values(formData).every(val => val.trim() !== '') && isBusinessEmail(formData.workEmail);
  const isStep2Valid = Object.values(agreements).every(val => val === true);

  // --- NEW: HubSpot Submission Logic ---
  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hubspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStep(2); // Move to step 2 only if HubSpot succeeds
      } else {
        alert("There was an issue saving your details. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#2b3a2a] text-white p-8 md:p-16 font-sans flex flex-col">
      <div className="flex justify-between items-center mb-16">
        <Link href="https://cambridgenexus.com/">
          <svg width="210" height="27" viewBox="0 0 210 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
            <path d="M35.4634 7.76562C36.3745 7.76562 37.2097 7.85888 37.9683 8.04492C38.7316 8.22621 39.4406 8.50494 40.0942 8.88184L39.0493 10.5996C38.8538 10.4708 38.6271 10.356 38.3696 10.2559C38.1168 10.1557 37.8442 10.0727 37.5532 10.0059C37.267 9.93431 36.9688 9.87898 36.6587 9.84082C36.3536 9.80269 36.0508 9.7842 35.7505 9.78418C35.0255 9.78418 34.3787 9.87444 33.811 10.0557C33.2435 10.2321 32.7637 10.4824 32.3726 10.8066C31.9862 11.1262 31.69 11.5106 31.4849 11.959C31.2845 12.4025 31.1841 12.8916 31.1841 13.4258C31.1841 13.9791 31.2896 14.4875 31.4995 14.9502C31.7094 15.4128 32.0119 15.8137 32.4077 16.1523C32.8084 16.4863 33.2952 16.7496 33.8677 16.9404C34.4449 17.1265 35.0966 17.2188 35.8218 17.2188C36.1509 17.2187 36.4779 17.1952 36.8022 17.1475C37.1266 17.0998 37.4393 17.0352 37.7397 16.9541C38.045 16.8682 38.3382 16.7678 38.6196 16.6533C38.901 16.5341 39.1635 16.4059 39.4067 16.2676L40.4517 17.9844C39.841 18.3756 39.135 18.684 38.3335 18.9082C37.532 19.1276 36.6804 19.2373 35.7788 19.2373C34.629 19.2373 33.6198 19.0888 32.7515 18.793C31.8833 18.4924 31.1577 18.0825 30.5757 17.5625C29.9938 17.0378 29.555 16.4218 29.2593 15.7158C28.9684 15.0051 28.8228 14.2415 28.8228 13.4258C28.8228 12.6292 28.9734 11.8871 29.2739 11.2002C29.5745 10.5087 30.0082 9.90986 30.5757 9.4043C31.1482 8.89384 31.845 8.49317 32.6655 8.20215C33.4908 7.91116 34.4235 7.76566 35.4634 7.76562ZM123.264 7.76562C123.651 7.76562 124.037 7.78715 124.423 7.83008C124.815 7.86824 125.199 7.92976 125.576 8.01562C125.957 8.1015 126.327 8.21212 126.685 8.3457C127.048 8.47449 127.391 8.6293 127.715 8.81055L126.67 10.5283C126.475 10.4139 126.253 10.3113 126.005 10.2207C125.757 10.1253 125.49 10.0464 125.204 9.98438C124.922 9.91761 124.629 9.86738 124.324 9.83398C124.023 9.80059 123.72 9.78418 123.415 9.78418C122.708 9.78418 122.078 9.87437 121.525 10.0557C120.972 10.2322 120.504 10.4824 120.123 10.8066C119.741 11.1262 119.45 11.5106 119.25 11.959C119.049 12.4074 118.949 12.8993 118.949 13.4336C118.949 13.9869 119.054 14.4953 119.264 14.958C119.474 15.4206 119.772 15.8185 120.159 16.1523C120.545 16.4863 121.012 16.7496 121.561 16.9404C122.11 17.1264 122.723 17.2187 123.4 17.2188C123.939 17.2188 124.433 17.1593 124.881 17.04C125.33 16.916 125.721 16.7418 126.055 16.5176C126.389 16.2934 126.661 16.0238 126.871 15.709C127.08 15.3894 127.219 15.0317 127.286 14.6357H123.378V12.7676H129.326V12.7754L129.333 12.7676C129.452 13.3401 129.488 13.8985 129.44 14.4424C129.397 14.9814 129.273 15.4918 129.068 15.9736C128.867 16.4507 128.591 16.8903 128.238 17.291C127.885 17.6916 127.462 18.0372 126.971 18.3281C126.48 18.6144 125.921 18.8388 125.296 19.001C124.671 19.1584 123.987 19.2373 123.243 19.2373C122.203 19.2373 121.27 19.0846 120.445 18.7793C119.624 18.474 118.927 18.0559 118.355 17.5264C117.783 16.9968 117.344 16.3768 117.039 15.666C116.738 14.9552 116.587 14.1968 116.587 13.3906C116.587 12.6035 116.735 11.8687 117.031 11.1865C117.327 10.4995 117.759 9.90317 118.327 9.39746C118.894 8.89177 119.591 8.49316 120.417 8.20215C121.247 7.91123 122.196 7.76563 123.264 7.76562ZM108.042 7.90234C109.24 7.90234 110.28 8.03151 111.163 8.28906C112.045 8.54669 112.776 8.91658 113.353 9.39844C113.935 9.87548 114.367 10.4576 114.648 11.1445C114.934 11.8266 115.078 12.5945 115.078 13.4482C115.078 14.2593 114.937 15.0114 114.656 15.7031C114.374 16.39 113.945 16.9865 113.368 17.4922C112.79 17.9931 112.06 18.3866 111.177 18.6729C110.295 18.9543 109.255 19.0947 108.057 19.0947L103.943 19.0879V7.90234H108.042ZM54.5854 19.0879H52.2026L51.3081 17.2051H44.7739L43.9087 19.0879H41.5181L46.771 7.90234H49.1753L54.5854 19.0879ZM62.6646 11.9814L66.73 7.90234H68.9985V19.0879H66.73V11.0439L62.6646 14.958L58.6001 11.0439V19.0879H56.3315V7.90234H58.6001L62.6646 11.9814ZM78.1587 7.90234C78.8885 7.90235 79.5229 7.98126 80.062 8.13867C80.6058 8.29132 81.0568 8.50349 81.4146 8.77539C81.7724 9.04733 82.0377 9.37213 82.2095 9.74902C82.3858 10.121 82.4741 10.5241 82.4741 10.958C82.4741 11.6689 82.2497 12.2918 81.8013 12.8262C82.3164 13.1315 82.7008 13.5271 82.9536 14.0137C83.2064 14.5002 83.3325 15.0537 83.3325 15.6738C83.3325 16.1939 83.2444 16.6641 83.0679 17.084C82.8962 17.5036 82.6315 17.8636 82.2739 18.1641C81.9209 18.4598 81.4721 18.6894 80.9282 18.8516C80.3891 19.009 79.7518 19.0879 79.0171 19.0879H72.1831V7.90234H78.1587ZM91.3257 7.90234C92.1844 7.90234 92.9293 7.99254 93.5591 8.17383C94.1886 8.35032 94.7105 8.60866 95.1255 8.94727C95.5406 9.286 95.8489 9.69892 96.0493 10.1855C96.2543 10.672 96.3569 11.2228 96.3569 11.8379C96.3569 12.253 96.3067 12.6495 96.2065 13.0264C96.1064 13.3984 95.9515 13.7419 95.7417 14.0566C95.5366 14.3715 95.2763 14.6533 94.9614 14.9014C94.6466 15.1447 94.2766 15.3476 93.8521 15.5098L96.2856 19.0879H93.5083L91.4048 15.9102H91.3403L87.9048 15.9033V19.0879H85.6372V7.90234H91.3257ZM101.044 19.0879H98.7612V7.90234H101.044V19.0879ZM141.535 9.8916H134.278V12.125H140.705V13.9922H134.278V17.1055H141.684V19.0879H132.009V7.90234H141.535V9.8916ZM106.21 17.127H108.601C109.279 17.127 109.873 17.0409 110.383 16.8691C110.894 16.6926 111.318 16.4445 111.657 16.125C112 15.8054 112.258 15.419 112.43 14.9658C112.602 14.5126 112.687 14.0064 112.687 13.4482C112.687 12.8997 112.602 12.4057 112.43 11.9668C112.258 11.5232 112 11.1491 111.657 10.8438C111.318 10.5337 110.894 10.2949 110.383 10.1279C109.873 9.96095 109.279 9.87793 108.601 9.87793H106.21V17.127ZM74.4517 17.1123H79.0747C79.6853 17.1123 80.1485 16.9811 80.4634 16.7188C80.7828 16.4564 80.9429 16.0863 80.9429 15.6094C80.9428 15.1325 80.7828 14.7603 80.4634 14.4932C80.1485 14.226 79.6853 14.0928 79.0747 14.0928H74.4517V17.1123ZM45.6401 15.3379H50.4136L47.9946 10.2568L45.6401 15.3379ZM87.9048 13.9424H91.3833C91.8125 13.9424 92.1868 13.8921 92.5063 13.792C92.8305 13.6919 93.1003 13.5512 93.3149 13.3701C93.5344 13.1888 93.6973 12.9686 93.8022 12.7109C93.9119 12.4487 93.9663 12.1574 93.9663 11.8379C93.9662 11.2131 93.752 10.7312 93.3228 10.3926C92.8934 10.0491 92.2468 9.87794 91.3833 9.87793H87.9048V13.9424ZM74.4517 12.1963H79.0317C79.2273 12.1963 79.418 12.2035 79.604 12.2178C79.9236 11.9125 80.0835 11.564 80.0835 11.1729C80.0835 10.7673 79.9237 10.4548 79.604 10.2354C79.2892 10.0112 78.8267 9.89947 78.2163 9.89941H74.4517V12.1963Z" fill="white"/>
            <path d="M203.031 7.75781C203.532 7.75781 204.035 7.78653 204.541 7.84375C205.047 7.89623 205.539 7.97208 206.016 8.07227C206.497 8.17245 206.961 8.29437 207.404 8.4375C207.848 8.57578 208.26 8.73071 208.642 8.90234L207.647 10.7344C207.333 10.596 206.993 10.47 206.631 10.3555C206.268 10.2362 205.889 10.1337 205.493 10.0479C205.097 9.96201 204.687 9.89536 204.263 9.84766C203.843 9.7952 203.413 9.76857 202.975 9.76855C202.35 9.76855 201.834 9.81371 201.429 9.9043C201.028 9.99489 200.708 10.1119 200.47 10.2549C200.231 10.3932 200.064 10.5511 199.969 10.7275C199.878 10.8993 199.833 11.0714 199.833 11.2432C199.833 11.5769 199.983 11.8508 200.283 12.0654C200.584 12.2753 201.042 12.3808 201.657 12.3809C201.905 12.3809 202.189 12.3644 202.509 12.3311C202.833 12.2929 203.172 12.2519 203.525 12.209C203.883 12.1661 204.246 12.1281 204.613 12.0947C204.985 12.0566 205.345 12.0371 205.693 12.0371C206.352 12.0371 206.934 12.1109 207.439 12.2588C207.95 12.4067 208.377 12.6198 208.721 12.8965C209.064 13.1684 209.325 13.4995 209.501 13.8906C209.677 14.2771 209.766 14.7115 209.766 15.1934C209.766 15.8374 209.615 16.4123 209.314 16.918C209.019 17.4188 208.594 17.8432 208.041 18.1914C207.492 18.5348 206.829 18.7972 206.052 18.9785C205.274 19.155 204.407 19.2432 203.453 19.2432C202.824 19.2431 202.208 19.2031 201.607 19.1221C201.006 19.0457 200.428 18.9361 199.875 18.793C199.326 18.6451 198.802 18.4708 198.301 18.2705C197.805 18.0654 197.344 17.8409 196.92 17.5977L198.129 15.7588C198.534 15.9878 198.945 16.1948 199.36 16.3809C199.78 16.5621 200.215 16.7179 200.663 16.8467C201.111 16.9706 201.581 17.066 202.072 17.1328C202.568 17.1996 203.096 17.2324 203.654 17.2324C204.327 17.2324 204.899 17.1893 205.371 17.1035C205.843 17.0129 206.228 16.8919 206.523 16.7393C206.824 16.5818 207.041 16.3954 207.175 16.1807C207.313 15.966 207.383 15.7323 207.383 15.4795C207.383 15.074 207.213 14.7543 206.874 14.5205C206.535 14.2821 206.013 14.1631 205.307 14.1631C204.997 14.1631 204.67 14.1847 204.327 14.2275C203.984 14.2657 203.635 14.3078 203.282 14.3555C202.934 14.4032 202.588 14.4492 202.244 14.4922C201.905 14.5303 201.586 14.5488 201.285 14.5488C200.784 14.5488 200.303 14.4843 199.84 14.3555C199.382 14.2267 198.974 14.0339 198.616 13.7764C198.263 13.5188 197.981 13.1969 197.771 12.8105C197.562 12.4242 197.457 11.9731 197.457 11.458C197.457 11.1527 197.497 10.8494 197.578 10.5488C197.664 10.2483 197.798 9.96234 197.979 9.69043C198.166 9.41372 198.403 9.1576 198.694 8.92383C198.985 8.68529 199.337 8.48034 199.747 8.30859C200.162 8.13695 200.639 8.00358 201.178 7.9082C201.722 7.80802 202.34 7.75782 203.031 7.75781ZM186.042 14.0596C186.042 14.5651 186.112 15.0162 186.25 15.4121C186.388 15.8033 186.593 16.1353 186.865 16.4072C187.142 16.6792 187.483 16.8871 187.889 17.0303C188.294 17.1686 188.767 17.2373 189.306 17.2373C189.84 17.2373 190.31 17.1686 190.716 17.0303C191.126 16.8871 191.467 16.6791 191.739 16.4072C192.016 16.1353 192.223 15.8032 192.361 15.4121C192.5 15.0162 192.569 14.5651 192.569 14.0596V7.89844H194.838V14.332C194.838 15.0667 194.714 15.7348 194.466 16.3359C194.218 16.937 193.857 17.4525 193.385 17.8818C192.912 18.3111 192.332 18.6422 191.646 18.876C190.963 19.1097 190.183 19.2266 189.306 19.2266C188.428 19.2266 187.645 19.1097 186.958 18.876C186.276 18.6422 185.699 18.311 185.227 17.8818C184.754 17.4525 184.395 16.9369 184.146 16.3359C183.898 15.7348 183.774 15.0667 183.774 14.332V7.89844H186.042V14.0596ZM154.375 11.5479V7.89844H156.644V19.084H154.375V13.9531L147.405 10.3242V19.084H145.137V7.89844H147.405L154.375 11.5479ZM169.333 9.8877H162.076V12.1211H168.503V13.9883H162.076V17.1016H169.482V19.084H159.808V7.89844H169.333V9.8877ZM176.624 11.748L179.608 7.89844H182.343L177.963 13.3799L182.492 19.084H179.709L176.524 15.0615L173.269 19.084H170.527L175.179 13.4014L170.878 7.89844H173.654L176.624 11.748Z" fill="#6CD653"/>
            <path d="M0 7.57591L14.6739 0L24.3643 4.89494L9.96721 12.419V27L0 22.0186V7.57591Z" fill="white"/>
            <path d="M14.6567 24.6973V14.9766L24.3471 19.8196L14.6567 24.6973Z" fill="#6CD653"/>
          </svg>
        </Link>
        <Link href="https://cambridgenexus.com/enterprise-access" className="border border-gray-500 px-4 py-2 text-white hover:bg-gray-700 transition">
          CLOSE X
        </Link>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto w-full">
        {/* LEFT COLUMN */}
        <div>
          {step === 1 ? (
            <>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Request Private Enterprise Access</h1>
              <p className="text-lg text-gray-300 mb-12">
                Tell us about your organization and AI infrastructure needs. Qualified buyers and strategic partners may receive access to CNEX's private evaluation materials.
              </p>
              <p className="text-sm text-gray-400 mt-auto pt-16">
                By submitting, you agree to our <Link href="https://cambridgenexus.com/terms-conditions" className="underline hover:text-white">Terms of Service</Link> and <Link href="https://cambridgenexus.com/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Export Control & Compliance</h1>
              <p className="text-lg text-gray-300 mb-12">
                To proceed with your request, please self-certify your compliance with U.S. export regulations.
              </p>
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white flex items-center gap-2 transition mb-8">
                ← Back to Details
              </button>
              <p className="text-sm text-gray-400 mt-auto pt-16">
                By submitting, you agree to our <Link href="https://cambridgenexus.com/terms-conditions" className="underline hover:text-white">Terms of Service</Link> and <Link href="https://cambridgenexus.com/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <input type="text" name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2" required />
              
              <div>
                <input type="email" name="workEmail" placeholder="Work email *" value={formData.workEmail} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2" required />
                {formData.workEmail && !isBusinessEmail(formData.workEmail) && (
                  <span className="text-red-400 text-xs mt-1 block">Please enter a valid business email.</span>
                )}
              </div>

              <input type="text" name="companyName" placeholder="Company name *" value={formData.companyName} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2" required />
              
              <input type="text" name="role" placeholder="Role / Title *" value={formData.role} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2" required />

              <select name="companyType" value={formData.companyType} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2 text-white appearance-none" required>
                <option value="" disabled className="text-gray-900">Company Type *</option>
                <option value="startup" className="text-gray-900">Startup</option>
                <option value="enterprise" className="text-gray-900">Enterprise</option>
                <option value="research" className="text-gray-900">Research / Academia</option>
              </select>

              <select name="capacity" value={formData.capacity} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2 text-white appearance-none" required>
                <option value="" disabled className="text-gray-900">Desired GPU Capacity *</option>
                <option value="1-8" className="text-gray-900">1 - 8 GPUs</option>
                <option value="8-64" className="text-gray-900">8 - 64 GPUs</option>
                <option value="64+" className="text-gray-900">64+ GPUs</option>
              </select>

              <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2 text-white appearance-none" required>
                <option value="" disabled className="text-gray-900">Target Deployment Timeline *</option>
                <option value="immediate" className="text-gray-900">Immediate</option>
                <option value="1-3months" className="text-gray-900">1 - 3 Months</option>
                <option value="3+months" className="text-gray-900">3+ Months</option>
              </select>

              <select name="workload" value={formData.workload} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2 text-white appearance-none" required>
                <option value="" disabled className="text-gray-900">Workload Type *</option>
                <option value="training" className="text-gray-900">AI Training</option>
                <option value="inference" className="text-gray-900">AI Inference</option>
                <option value="rendering" className="text-gray-900">3D Rendering</option>
              </select>

              <select name="region" value={formData.region} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2 text-white appearance-none" required>
                <option value="" disabled className="text-gray-900">Preferred Region *</option>
                <option value="us-east" className="text-gray-900">US East</option>
                <option value="us-west" className="text-gray-900">US West</option>
                <option value="eu" className="text-gray-900">Europe</option>
              </select>

              <select name="nda" value={formData.nda} onChange={handleInputChange} className="bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full pb-2 text-white appearance-none" required>
                <option value="" disabled className="text-gray-900">NDA Needed? *</option>
                <option value="yes" className="text-gray-900">Yes</option>
                <option value="no" className="text-gray-900">No</option>
              </select>

              <div className="col-span-1 md:col-span-2 mt-8 pt-8 border-t border-gray-600">
                <button 
                  onClick={handleNextStep} 
                  disabled={!isStep1Valid || isLoading}
                  className={`flex items-center justify-between w-full text-2xl font-semibold transition ${isStep1Valid && !isLoading ? 'text-green-500 cursor-pointer' : 'text-gray-500 cursor-not-allowed opacity-50'}`}
                >
                  {isLoading ? 'Saving...' : 'Next Step'} <span>↗</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {[
                { id: 'chk1', text: "Customer is not listed on any U.S. government restricted party list, including but not limited to the Entity List, Denied Persons List, or Specially Designated Nationals (SDN) List." },
                { id: 'chk2', text: "Customer is not owned or controlled by any entity or individual appearing on such restricted lists." },
                { id: 'chk3', text: "Customer is not organized in, and does not operate primarily from, any jurisdiction subject to comprehensive U.S. sanctions." },
                { id: 'chk4', text: "Customer agrees to use CNEX services in compliance with applicable U.S. export control and trade compliance laws, including the EAR." },
                { id: 'chk5', text: "Customer will not knowingly provide access to CNEX GPU services to restricted or sanctioned entities." }
              ].map((item) => (
                <label key={item.id} className="flex items-start gap-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreements[item.id]} 
                    onChange={(e) => setAgreements({...agreements, [item.id]: e.target.checked})}
                    className="mt-1 w-5 h-5 accent-green-500 bg-transparent border-gray-400"
                  />
                  <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                </label>
              ))}

              <div className="mt-8 pt-8 border-t border-gray-600">
                <button 
                  disabled={!isStep2Valid}
                  onClick={() => window.location.href = "https://app.hellosign.com/s/IK0g3pIS"}
                  className={`flex items-center justify-between w-full text-2xl font-semibold transition ${isStep2Valid ? 'text-white cursor-pointer hover:text-green-500' : 'text-gray-500 cursor-not-allowed opacity-50'}`}
                >
                  REVIEW & SIGN DOCU <span>↗</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
