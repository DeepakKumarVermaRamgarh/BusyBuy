import Spinner from "react-spinner-material";

const Loader = () => {
  // The Loader component displays a loading spinner at the center of the screen.
  // It uses the "react-spinner-material" package for the spinner, which allows customizing the spinner's appearance and behavior.
  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Spinner radius={120} color="#faae2b" stroke={2} visible={true} />
    </div>
  );
};

export default Loader;
