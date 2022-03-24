import React from "react";
import { NavLink } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const JoinAsFreelancerOrClient = () => {
  return (
    <div>
      <p>Join as a Freelancer or Client</p>
      <div>
            <Card>
                <CardContent>

                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    
                </CardContent>
            </Card>
      </div>
      <div>
        <button>Sign Up as a Freelancer</button>
        <p>
          Already have an account?{" "}
          <NavLink to={"/login"} className="navLink">
            Log In
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default JoinAsFreelancerOrClient;
