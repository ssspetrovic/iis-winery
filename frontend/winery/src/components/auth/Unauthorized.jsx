import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  <section>
    <div className="div-center">
      <h1>Unauthorized</h1>
      <p>You don't have the access to the requested page</p>
      <div className="flex-grow">
        <Button onClick={goBack}>Go Back</Button>
      </div>
    </div>
  </section>;
};

export default Unauthorized;
