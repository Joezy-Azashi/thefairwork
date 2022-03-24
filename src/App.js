import "./assets/css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { createContext, useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "./Services/auth";
import ResetPassword from "./Views/ResetPassword";
import Homepage from "./Views/Homepage";
import HomepageNavbar from "./Components/Layout/HomepageNavbar";
import ConfirmAccount from "./Components/Auth/ConfirmAccount";
import SignUp from "./Components/Auth/SignUp";
import { SignUpOptions } from "./Components/Auth/SignUpOptions";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import Login from "./Components/Auth/Login";
import Profile from "./Views/Profile/UserProfile";
import AcountSething from "./Views/Profile/AcountSething";
import EditProfile from "./Views/Profile/EditProfile";
import AllJobs from "./Views/AllJobs";
import FreelancerAllJobs from "./Views/FreelancerAllJobs";
import FreelancerAllJobsDetails from "./Views/FreelancerAllJobsDetails";
import ApplyJobsQuestions from "./Components/Job/ApplyJobsQuestions";
import TopNavbar from "./Components/NewLayout/TopNavbar";
import RecruiterPostJobs from "./Views/RecruiterPostJobs";
import RecruiterEditJob from "./Views/RecruiterEditJob";
import RecruiterLocalEditJob from "./Views/RecruiterLocalEditJob";
import AdminClients from "./Views/AdminClients";
import AdminFreelancers from "./Views/AdminFreelancers";
import AdminRecruiters from "./Views/AdminRecruiters";
import AdminPlatformAddOns from "./Views/AdminPlatformAddOns";
import AdminPlatformCategory from "./Views/AdminPlatformCategory";
import AdminDashboard from "./Views/AdminDashboard";
import CandidatePool from "./Views/CandidatePool";
import FinalAddTeam from "./Views/Client/FinalAddTeam";
import AdminNewOrders from "./Views/Admin Orders/AdminNewOrders";
import AdminOneOrder from "./Views/Admin Orders/AdminOneOrder";
import AdminApplicants from "./Views/AdminApplicants";
import ApplicantDetails from "./Components/Applicants/ApplicantDetails";
import RecruiterLogin from "./Components/Auth/RecruiterLogin";
import RecruiterSignUp from "./Components/Auth/RecruiterSignup";
import AllJobsDetails from "./Views/AllJobsDetails";
import AdminPlatformIndustry from "./Views/AdminPlatformIndustry";
import RecruiterAllJobs from "./Views/RecruiterAllJobs";
import LocalJobs from "./Views/LocalJobs";
import RecruiterLocalPostJob from "./Views/RecruiterLocalPostJob";
import AdminPayments from "./Views/AdminPayments";
import ViewPayments from "./Views/ViewPayments";
import AdminPages from "./Views/AdminPages";
import AddAdminPages from "./Views/AddAdminPages";
import AdminAllJobs from "./Views/AdminAllJobs";
import AdminJobDetails from "./Views/AdminJobDetails";
import Pages from "./Views/Pages";
import PagesLayout from "./Components/Layout/PagesLayout";
import ClientPaymentDue from "./Views/Client Payments/ClientPaymentDue";
import AdminPaymentDue from "./Views/Admin Payments/AdminPaymentDue";
import ClientPaymentInvoice from "./Views/Client Payments/ClientPaymentInvoice";
import AdminPaymentInvoice from "./Views/Admin Payments/AdminPaymentInvoice";
import ClientViewInvoice from "./Views/Client Payments/ClientViewInvoice";
import AdminAddsPaymentClient from "./Views/Admin Payments/AdminAddsPaymentClient";
import PaymentLevels from "./Views/PaymentLevels";
import Footer from "./Components/Layout/Footer";
import AboutTheFairWork from "./Views/AboutTheFairWork";
import BecomeAClient from "./Views/BecomeAClient";
import BecomeFreelancer from "./Views/BecomeFreelancer";
import PrivacyPolicy from "./Views/PrivacyPolicy";
import RedirectPage from "./Components/Auth/RedirectPage";
import DeleteAccount from "./Components/Auth/DeleteAccount";
import * as Cookies from "js-cookie";

function App() {
  return (
    <div className="App">
      <ProvideAuth>
        <BrowserRouter>
          <Switch>
            <Route exact={true} path={"/"}>
              <HomepageNavbar />
              <Homepage />
              <Footer />
            </Route>
            <Route path={"/login"}>
              <HomepageNavbar />
              <Login />
            </Route>
            <Route path={"/about-us"}>
              <HomepageNavbar />
              <AboutTheFairWork />
              <Footer />
            </Route>
            <Route path={"/become-a-client"}>
              <HomepageNavbar />
              <BecomeAClient />
              <Footer />
            </Route>
            <Route path={"/become-a-freelancer"}>
              <HomepageNavbar />
              <BecomeFreelancer />
              <Footer />
            </Route>
            <Route path={"/privacy-policy"}>
              <HomepageNavbar />
              <PrivacyPolicy />
              <Footer />
            </Route>
            <Route path={"/page"}>
              <PagesLayout />
              <Pages />
            </Route>
            <Route path={"/recruiter-login"}>
              <HomepageNavbar />
              <RecruiterLogin />
            </Route>
            <Route path={"/recruiter-signup"}>
              <HomepageNavbar />
              <RecruiterSignUp />
            </Route>
            <Route path={"/reset-password/:id"}>
              <HomepageNavbar />
              <ResetPassword />
            </Route>
            <Route path={"/forgot-password"}>
              <HomepageNavbar />
              <ForgotPassword />
            </Route>
            <Route path={"/signup-options"}>
              <HomepageNavbar />
              <SignUpOptions />
            </Route>
            <Route path={"/signup"}>
              <HomepageNavbar />
              <SignUp />
            </Route>
            <Route path={"/confirm-account"}>
              <HomepageNavbar />
              <ConfirmAccount />
            </Route>
            <Route path={"/auth"}>
              <RedirectPage />
            </Route>
            <Route path={"/data-deleted"}>
              <DeleteAccount />
            </Route>
            <PrivateRoute path={"/edit-profile"}>
              <TopNavbar page={<Profile />} />
            </PrivateRoute>
            <PrivateRoute path={"/account-settings"}>
              <TopNavbar page={<AcountSething />} />
            </PrivateRoute>
            <PrivateRoute path={"/profile"}>
              <TopNavbar page={<EditProfile />} />
            </PrivateRoute>
            <PrivateRoute path={"/all-jobs"}>
              <TopNavbar page={<AllJobs />} />
            </PrivateRoute>
            <PrivateRoute path={"/recruiter-all-jobs"}>
              <TopNavbar page={<RecruiterAllJobs />} />
            </PrivateRoute>
            <PrivateRoute path={"/candidate-pool"}>
              <TopNavbar page={<CandidatePool />} />
            </PrivateRoute>
            <PrivateRoute path={"/freelancer-all-jobs"}>
              <TopNavbar page={<FreelancerAllJobs />} />
            </PrivateRoute>
            <PrivateRoute path={"/paymentlevels"}>
              <TopNavbar page={<PaymentLevels />} />
            </PrivateRoute>
            <PrivateRoute path={"/local-jobs"}>
              <TopNavbar page={<LocalJobs />} />
            </PrivateRoute>
            <PrivateRoute path={"/freelancer-all-job-details"}>
              <TopNavbar page={<FreelancerAllJobsDetails />} />
            </PrivateRoute>
            <PrivateRoute path={"/all-job-details"}>
              <TopNavbar page={<AllJobsDetails />} />
            </PrivateRoute>
            <PrivateRoute path={"/admin-job-details"}>
              <TopNavbar page={<AdminJobDetails />} />
            </PrivateRoute>
            <PrivateRoute path={"/freelancer-all-job-questions"}>
              <TopNavbar page={<ApplyJobsQuestions />} />
            </PrivateRoute>
            <PrivateRoute path={"/post-jobs"}>
              <TopNavbar page={<RecruiterPostJobs />} />
            </PrivateRoute>
            <PrivateRoute path={"/recruiter-post-job"}>
              <TopNavbar page={<RecruiterLocalPostJob />} />
            </PrivateRoute>
            <PrivateRoute path={"/edit-jobs"}>
              <TopNavbar page={<RecruiterEditJob />} />
            </PrivateRoute>
            <PrivateRoute path={"/edit-recruiter-jobs"}>
              <TopNavbar page={<RecruiterLocalEditJob />} />
            </PrivateRoute>
            <PrivateRoute path={"/user-clients"}>
              <TopNavbar page={<AdminClients />} />
            </PrivateRoute>
            <PrivateRoute path={"/user-freelancers"}>
              <TopNavbar page={<AdminFreelancers />} />
            </PrivateRoute>
            <PrivateRoute path={"/user-recruiters"}>
              <TopNavbar page={<AdminRecruiters />} />
            </PrivateRoute>
            <PrivateRoute path={"/project-tools"}>
              <TopNavbar page={<AdminPlatformAddOns />} />
            </PrivateRoute>
            <PrivateRoute path={"/platform-category"}>
              <TopNavbar page={<AdminPlatformCategory />} />
            </PrivateRoute>
            <PrivateRoute path={"/local-category"}>
              <TopNavbar page={<AdminPlatformIndustry />} />
            </PrivateRoute>
            <PrivateRoute path={"/admin-dashboard"}>
              <TopNavbar page={<AdminDashboard />} />
            </PrivateRoute>
            <PrivateRoute path={"/admin-all-jobs"}>
              <TopNavbar page={<AdminAllJobs />} />
            </PrivateRoute>
            <PrivateRoute path={"/payments"}>
              <TopNavbar page={<AdminPayments />} />
            </PrivateRoute>
            <PrivateRoute path={"/view-payments"}>
              <TopNavbar page={<ViewPayments />} />
            </PrivateRoute>
            <PrivateRoute path={"/add-team"}>
              <TopNavbar page={<FinalAddTeam />} />
            </PrivateRoute>
            <PrivateRoute path={"/team-orders"}>
              <TopNavbar page={<AdminNewOrders />} />
            </PrivateRoute>
            <PrivateRoute path={"/one-order"}>
              <TopNavbar page={<AdminOneOrder />} />
            </PrivateRoute>
            <PrivateRoute path={"/client-payment-due"}>
              <TopNavbar page={<ClientPaymentDue />} />
            </PrivateRoute>
            <PrivateRoute path={"/client-invoice"}>
              <TopNavbar page={<ClientViewInvoice />} />
            </PrivateRoute>
            <PrivateRoute path={"/all-payment-due"}>
              <TopNavbar page={<AdminPaymentDue />} />
            </PrivateRoute>
            <PrivateRoute path={"/all-invoices"}>
              <TopNavbar page={<AdminPaymentInvoice />} />
            </PrivateRoute>
            <PrivateRoute path={"/client-invoices"}>
              <TopNavbar page={<ClientPaymentInvoice />} />
            </PrivateRoute>
            <PrivateRoute path={"/admin-pages"}>
              <TopNavbar page={<AdminPages />} />
            </PrivateRoute>
            <PrivateRoute path={"/add-admin-page"}>
              <TopNavbar page={<AddAdminPages />} />
            </PrivateRoute>
            <PrivateRoute path={"/applicants"}>
              <TopNavbar page={<AdminApplicants />} />
            </PrivateRoute>
            <PrivateRoute path={"/applicantdetails"}>
              <TopNavbar page={<ApplicantDetails />} />
            </PrivateRoute>
            <PrivateRoute path={"/create-payment"}>
              <TopNavbar page={<AdminAddsPaymentClient />} />
            </PrivateRoute>
          </Switch>
        </BrowserRouter>
      </ProvideAuth>
    </div>
  );
}

export default App;

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  let current_user = getCurrentUser();

  if (!auth) {
    return (
      <Route
        {...rest}
        render={({ location }) => (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )}
      />
    );
  }
  if (!current_user.user.accountTypeId) {
    return (
      <Route
        {...rest}
        render={({ location }) => (
          <Redirect
            to={{
              pathname: "/signup-options",
              state: { from: location },
            }}
          />
        )}
      />
    );
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function LoginRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = isLoggedIn();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useAuth() {
  return useContext(authContext);
}
