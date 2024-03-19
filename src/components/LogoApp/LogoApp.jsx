const LogoApp = ({ ...props }) => {
  return (
    <div {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          fill="#FE4A4B"
          fill-rule="evenodd"
          d="M0 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.382l2.553-1.276A1 1 0 0 1 16 5v6a1 1 0 0 1-1.447.894L12 10.618V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4 2.5a.5.5 0 0 1 .724-.447l3 1.5a.5.5 0 0 1 0 .894l-3 1.5A.5.5 0 0 1 4 9.5z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  );
};

export default LogoApp;
