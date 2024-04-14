import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <div>
      <div className="div-center">
        <h1>Unauthorized</h1>
        <p>You don't have the access to the requested page</p>
        <div className="align-center">
          <Button onClick={goBack}>Go Back</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
