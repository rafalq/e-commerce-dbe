export default function CustomForm() {
  return (
    <>
      <div className="bg-white px-6 lg:px-8 py-24 sm:py-32 isolate">
        <div
          className="top-[-10rem] sm:top-[-20rem] -z-10 absolute inset-x-0 blur-3xl transform-gpu overflow-hidden"
          aria-hidden="true"
        >
          {/* <div className="relative left-1/2 sm:left-[calc(50%-40rem)] -z-10 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 w-[36.125rem] sm:w-[72.1875rem] max-w-none -translate-x-1/2 aspect-[1155/678] rotate-[30deg]" style={'clipPath': polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)}></div> */}
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold text-3xl text-gray-900 sm:text-4xl tracking-tight">
            Contact sales
          </h2>
          <p className="mt-2 text-gray-600 text-lg leading-8">
            Aute magna irure deserunt veniam aliqua magna enim voluptate.
          </p>
        </div>
        <form
          action="#"
          method="POST"
          className="mx-auto mt-16 sm:mt-20 max-w-xl"
        >
          <div className="gap-x-8 gap-y-6 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block font-semibold text-gray-900 text-sm leading-6"
              >
                First name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block border-0 shadow-sm px-3.5 py-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block font-semibold text-gray-900 text-sm leading-6"
              >
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block border-0 shadow-sm px-3.5 py-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block font-semibold text-gray-900 text-sm leading-6"
              >
                Company
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="company"
                  id="company"
                  autoComplete="organization"
                  className="block border-0 shadow-sm px-3.5 py-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block font-semibold text-gray-900 text-sm leading-6"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="block border-0 shadow-sm px-3.5 py-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="phone-number"
                className="block font-semibold text-gray-900 text-sm leading-6"
              >
                Phone number
              </label>
              <div className="relative mt-2.5">
                <div className="left-0 absolute inset-y-0 flex items-center">
                  <label htmlFor="country" className="sr-only">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="border-0 bg-transparent bg-none py-0 pr-9 pl-4 rounded-md focus:ring-2 focus:ring-indigo-600 focus:ring-inset h-full text-gray-400 sm:text-sm"
                  >
                    <option>US</option>
                    <option>CA</option>
                    <option>EU</option>
                  </select>
                  <svg
                    className="top-0 right-3 absolute w-5 h-full text-gray-400 pointer-events-none"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone-number"
                  id="phone-number"
                  autoComplete="tel"
                  className="block border-0 shadow-sm px-3.5 py-2 pl-20 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block font-semibold text-gray-900 text-sm leading-6"
              >
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="block border-0 shadow-sm px-3.5 py-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-x-4 sm:col-span-2">
              <div className="flex items-center h-6">
                {/* <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" --> */}
                <button
                  type="button"
                  className="flex flex-none bg-gray-200 p-px rounded-full ring-1 ring-gray-900/5 ring-inset w-8 transition-colors duration-200 cursor-pointer ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  role="switch"
                  aria-checked="false"
                  aria-labelledby="switch-1-label"
                >
                  <span className="sr-only">Agree to policies</span>
                  {/* <!-- Enabled: "translate-x-3.5", Not Enabled: "translate-x-0" --> */}
                  <span
                    aria-hidden="true"
                    className="bg-white shadow-sm rounded-full ring-1 ring-gray-900/5 w-4 h-4 transform transition translate-x-0 duration-200 ease-in-out"
                  ></span>
                </button>
              </div>
              <label
                className="text-gray-600 text-sm leading-6"
                id="switch-1-label"
              >
                By selecting this, you agree to our
                <a href="#" className="font-semibold text-indigo-600">
                  privacy&nbsp;policy
                </a>
                .
              </label>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block bg-indigo-600 hover:bg-indigo-500 shadow-sm px-3.5 py-2.5 rounded-md w-full font-semibold text-center text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Let&apos;s talk
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
