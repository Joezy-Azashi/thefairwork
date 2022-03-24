import {
  Avatar,
  Button,
  Card,
  DialogContent,
  Paper,
  Chip,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import ReactHtmlParser from "react-html-parser";
import { useLocation } from "react-router";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import { getCurrentUser, getUserType } from "../../Services/auth";

import {
  mdiCellphoneBasic,
  mdiCheckboxMarkedCircle,
  mdiMapMarkerOutline,
  mdiWeb,
  mdiLinkedin,
  mdiGithub,
  mdiCash,
  mdiTrophyOutline,
} from "@mdi/js";
import EmailOutlined from "@material-ui/icons/EmailOutlined";
import ShowMoreText from "react-show-more-text";
import moment from "moment";
import formatPaymentLevel from "../../Services/paymentLevels";
import Api from "../../Services/api";
import { AppliDetailsSkillLevelGroup } from "../Profile/SkillsDisplay";

const ApplicantDetails = () => {
  const location = useLocation();
  const [profileData, setProfileData] = useState(
    location?.state?.params === undefined
      ? JSON.parse(localStorage.getItem("profileDatas"))
      : [location?.state?.params]
  );
  const [isReadMore, setIsReadMore] = useState(true);
  const [userSkillTag, setUserSkillTag] = useState([]);
  const [userSkillType, setUserSkillType] = useState([]);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const getUserSkillTag = async (userAccountId) => {
    Api()
      .get(`/users/get-tag/${userAccountId}`)
      .then((response) => {
        setUserSkillTag(response?.data);
      })
      .catch((error) => {
        setUserSkillTag([]);
      });
  };

  const getUserSkillType = async (userAccountId) => {
    Api()
      .get(`/users/get-skill-type/${userAccountId}`)
      .then((response) => {
        setUserSkillType(response?.data?.GCAs);
      })
      .catch((error) => {
        setUserSkillType([]);
      });
  };

  useEffect(() => {
    localStorage.setItem("profileDatas", JSON.stringify(profileData));
    getUserSkillTag(profileData[0].UserAccount.id);
    getUserSkillType(profileData[0].UserAccount.id);
  }, []);
  return (
    <div>
      {profileData &&
        profileData?.map((profile) =>
          profile?.UserAccount ? (
            <Card className="mb-4 p-5">
              <div className="row ">
                <div className="col-md-8 d-flex cpImage">
                  <div>
                    <Avatar
                      alt="Candidate Image"
                      src={profile?.UserAccount?.UserProfile?.profile_picture}
                      className="cpAvatar2 mt-0 mr-4"
                    />
                    {getUserType()?.accountTypeId === 3 ||
                    getUserType()?.accountTypeId === 2 ? (
                      <div className="profile-links d-flex justify-content-center align-item-center mt-2">
                        {profile?.UserAccount?.UserProfile?.github ? (
                          <div>
                            <a
                              href={
                                "//" + profile?.UserAccount?.UserProfile?.github
                              }
                              target="_blank"
                              without
                              rel="noreferrer"
                            >
                              <Icon
                                path={mdiGithub}
                                size={1.1}
                                color="#967BB6"
                              />
                            </a>
                          </div>
                        ) : (
                          ``
                        )}

                        {profile?.UserAccount?.UserProfile?.linkedIn ? (
                          <div>
                            <a
                              href={
                                "//" +
                                profile?.UserAccount?.UserProfile?.linkedIn
                              }
                              target="_blank"
                              without
                              rel="noreferrer"
                            >
                              <Icon
                                path={mdiLinkedin}
                                size={1.1}
                                color="#0A66C2"
                              />
                            </a>
                          </div>
                        ) : (
                          ``
                        )}
                      </div>
                    ) : null}
                  </div>
                  <div className="">
                    <p className="bodyTitles">
                      {getUserType()?.accountTypeId === 3 ||
                      getUserType()?.accountTypeId === 2 ? (
                        <b>
                          {profile?.UserAccount?.UserProfile?.firstname +
                            " " +
                            profile?.UserAccount?.UserProfile?.lastname}
                        </b>
                      ) : (
                        <b>{profile?.UserAccount?.UserProfile?.firstname}</b>
                      )}
                    </p>

                    <p
                      style={{
                        marginTop: "-15px",
                        color: "#808080",
                        textTransform: "capitalize",
                      }}
                    >
                      {profile?.UserAccount?.UserProfile?.role}
                    </p>

                    <div className="summaryWeb">
                      <p
                        style={{
                          color: "#707070",
                          marginTop: "27px",
                          marginBottom: "5px",
                        }}
                      >
                        Summary pitch
                      </p>

                      <ShowMoreText
                        lines={6}
                        more="read more"
                        less="read less"
                        expanded={false}
                        width={window.screen.width >= 1920 ? 500 : 380}
                        className="showMore"
                      >
                        <p style={{ color: "#555555" }}>
                          {profile?.UserAccount?.UserProfile?.summary}
                        </p>
                      </ShowMoreText>
                    </div>
                  </div>
                </div>

                <div className="summaryMobile">
                  <p style={{ color: "#707070", marginTop: "27px" }}>
                    Summary pitch
                  </p>

                  <ShowMoreText
                    lines={7}
                    more="Read more"
                    less="Read less"
                    expanded={false}
                    width={window.screen.width >= 1920 ? 500 : 380}
                    className="showMore"
                  >
                    <p style={{ color: "#555555" }}>
                      {profile?.UserAccount?.UserProfile?.summary}
                    </p>
                  </ShowMoreText>
                </div>

                <div className="col-md-1 colSpace">
                  <hr className="line" />
                </div>

                <div className="col-md-3">
                  {getUserType().accountTypeId === 2 ||
                  getUserType().accountTypeId === 3 ? (
                    <div className="d-flex">
                      <EmailOutlined style={{ color: "#F70000" }} />
                      <p style={{ marginLeft: "8px", color: "#707070" }}>
                        <a
                          href={`tel:${
                            profile?.UserAccount?.UserProfile?.countryCode +
                            parseInt(profile?.UserAccount?.UserProfile?.phone)
                          }`}
                          style={{ textDecoration: "none", color: "#707070" }}
                        >
                          {profile?.UserAccount?.UserProfile?.countryCode}{" "}
                          {profile?.UserAccount?.UserProfile?.phone}
                        </a>
                      </p>
                    </div>
                  ) : null}

                  {profile?.UserAccount?.UserProfile?.phone ? (
                    getUserType().accountTypeId === 2 ||
                    getUserType().accountTypeId === 3 ? (
                      <div className="d-flex mt-1">
                        <Icon
                          path={mdiCellphoneBasic}
                          size={1}
                          color="#AC5CF2"
                        />
                        <p style={{ marginLeft: "8px", color: "#707070" }}>
                          <a
                            href={`tel:${
                              profile?.UserAccount?.UserProfile?.countryCode +
                              parseInt(profile?.UserAccount?.UserProfile?.phone)
                            }`}
                            style={{ textDecoration: "none", color: "#707070" }}
                          >
                            {profile?.UserAccount?.UserProfile?.countryCode}{" "}
                            {profile?.UserAccount?.UserProfile?.phone}
                          </a>
                        </p>
                      </div>
                    ) : null
                  ) : null}

                  {profile?.UserAccount?.UserProfile?.website ? (
                    <div className="GCAView mt-1">
                      <Icon path={mdiWeb} size={1} color="#55A8FD" />
                      <p
                        style={{
                          marginLeft: "8px",
                          color: "#707070",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        <a
                          href={
                            "//" + profile?.UserAccount?.UserProfile?.website
                          }
                          target="_blank"
                          style={{ textDecoration: "none" }}
                        >
                          {profile?.UserAccount?.UserProfile?.website}
                        </a>
                      </p>
                    </div>
                  ) : (
                    ``
                  )}

                  {profile?.UserAccount?.UserProfile?.city &&
                  profile?.UserAccount?.UserProfile?.Country?.name ? (
                    <div className="GCAView mt-1">
                      <Icon
                        path={mdiMapMarkerOutline}
                        size={1}
                        color="#FFB648"
                      />
                      <p
                        style={{
                          marginLeft: "8px",
                          color: "#707070",
                          textTransform: "capitalize",
                        }}
                      >
                        {profile?.UserAccount?.UserProfile?.city},{" "}
                        {profile?.UserAccount?.UserProfile?.Country?.name}
                      </p>
                    </div>
                  ) : profile?.UserAccount?.UserProfile?.city ? (
                    <div className="d-flex mt-1">
                      <Icon
                        path={mdiMapMarkerOutline}
                        size={1}
                        color="#FFB648"
                      />
                      <p
                        style={{
                          marginLeft: "8px",
                          color: "#707070",
                          textTransform: "capitalize",
                        }}
                      >
                        {profile?.UserAccount?.UserProfile?.city}
                      </p>
                    </div>
                  ) : profile?.UserAccount?.UserProfile?.Country?.name ? (
                    <div className="d-flex mt-1">
                      <Icon
                        path={mdiMapMarkerOutline}
                        size={1}
                        color="#FFB648"
                      />
                      <p
                        style={{
                          marginLeft: "8px",
                          color: "#707070",
                          textTransform: "capitalize",
                        }}
                      >
                        {profile?.UserAccount?.UserProfile?.Country?.name}
                      </p>
                    </div>
                  ) : (
                    ``
                  )}
                  {profile?.UserAccount?.UserProfile?.GCA ? (
                    <div className="GCAView mt-1">
                      <Icon path={mdiTrophyOutline} size={1} color="#009E20" />

                      <p
                        style={{
                          marginLeft: "8px",
                          // marginTop: "2px",
                          color: "#707070",
                        }}
                      >
                        <span
                          style={{ marginBottom: "2px" }}
                          className="GCAMobile"
                        >
                          Coding Assessment (GCA) &nbsp;
                        </span>
                        <Chip
                          icon={
                            <Icon
                              path={mdiCheckboxMarkedCircle}
                              size={0.6}
                              horizontal
                              vertical
                              color="#009E20"
                              rotate={180}
                              type="button"
                            />
                          }
                          style={{
                            background: "#009E2026",
                            color: "#009E20",
                            height: "20px",
                            marginBottom: "3px",
                          }}
                          className="skillChipWeb GCAMobile"
                          label={profile?.UserAccount?.UserProfile?.GCA}
                          variant="outlined"
                        />
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  {profile?.UserAccount?.PaymentLevel ? (
                    <div className="GCAView mt-1">
                      <Icon path={mdiCash} size={1.1} color="#4A56FF" />

                      <p
                        style={{
                          marginLeft: "8px",
                          marginTop: "2px",
                          color: "#707070",
                        }}
                      >
                        {profile?.UserAccount?.PaymentLevel?.name} (
                        {formatPaymentLevel(
                          profile?.UserAccount?.PaymentLevel?.amount
                        )}
                        )
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  {profile?.UserAccount?.UserProfile?.CV ? (
                    <div className="mt-1">
                      <Button
                        variant="contained"
                        className="addCartBtn"
                        fullWidth
                      >
                        <a
                          href={profile?.UserAccount?.UserProfile?.CV}
                          rel="noreferrer"
                          target="_blank"
                          style={{ textDecoration: "none", color: "white" }}
                          download
                        >
                          {" "}
                          View Resume
                        </a>
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Card>
          ) : (
            ""
          )
        )}

      {profileData &&
        profileData?.map((profile) =>
          profile?.UserAccount?.Education.length > 0 ? (
            <Card className="mb-4 p-5">
              <div className="col-md-12 mt-2 mb-3">
                <p className="bodyTitles">
                  <b>Education</b>
                </p>
                <hr className="mt-3" />
              </div>
              <div className="col-md-12 mb-2">
                {profile?.UserAccount?.Education?.map((edu) => (
                  <>
                    <div
                      className="applicantDetail mt-4"
                      style={{ marginRight: "40px" }}
                    >
                      <p className="bodyTitles">
                        <b>{edu.institute_name}</b>
                      </p>
                      <p>
                        {moment(`${edu.start_date}`).format("Do MMMM YYYY")} -{" "}
                        {moment(`${edu.end_date}`).format("Do MMMM YYYY")}
                      </p>
                    </div>
                    <div>
                      <p style={{ marginTop: "-10px" }}>{edu.degree_title}</p>
                    </div>
                    <p style={{ marginTop: "-10px" }}>
                      {" "}
                      {edu.grade != null || "" ? edu.grade : "Not provided"}
                    </p>
                    <hr className="mt-4" />
                  </>
                ))}
              </div>

              <br />
            </Card>
          ) : (
            ""
          )
        )}

      {profileData &&
        profileData?.map((profile) =>
          profile?.UserAccount?.UserSkills.length > 0 ? (
            <Card className="mb-4 p-5">
              <div className="col-md-12 mt-2 mb-2">
                <p className="bodyTitles">Skills</p>
                <hr className="mt-1" />
                <div>
                  <div>
                    {(Boolean(
                      userSkillType?.find((test) => {
                        return test?.proficiency === "Expert";
                      })
                    ) ||
                      Boolean(
                        profile?.UserAccount?.UserSkills?.find((test) => {
                          return test?.proficiency === "Expert";
                        })
                      )) && (
                      <div className="row mb-3 pt-2">
                        <div className="col-6 col-sm-3 col-md-2 skill-level">
                          Expert
                        </div>
                        <div className="col-12 col-sm-9 col-md-10">
                          <AppliDetailsSkillLevelGroup
                            GCATest={userSkillType}
                            skillsData={profile?.UserAccount?.UserSkills}
                            proficiency="Expert"
                          />
                        </div>
                      </div>
                    )}

                    {(Boolean(
                      userSkillType?.find((test) => {
                        return test?.proficiency === "Intermediate";
                      })
                    ) ||
                      Boolean(
                        profile?.UserAccount?.UserSkills?.find((test) => {
                          return test?.proficiency === "Intermediate";
                        })
                      )) && (
                      <div className="row mb-3 pt-2">
                        <div className="col-6 col-sm-3 col-md-2 skill-level">
                          Intermediate
                        </div>
                        <div className="col-12 col-sm-9 col-md-10">
                          <AppliDetailsSkillLevelGroup
                            GCATest={userSkillType}
                            skillsData={profile?.UserAccount?.UserSkills}
                            proficiency="Intermediate"
                          />
                        </div>
                      </div>
                    )}

                    {(Boolean(
                      userSkillType?.find((test) => {
                        return test?.proficiency === "Beginner";
                      })
                    ) ||
                      Boolean(
                        profile?.UserAccount?.UserSkills?.find((test) => {
                          return test?.proficiency === "Beginner";
                        })
                      )) && (
                      <div className="row mb-3 pt-2">
                        <div className="col-6 col-sm-3 col-md-2 skill-level">
                          Beginner
                        </div>
                        <div className="col-12 col-sm-9 col-md-10">
                          <AppliDetailsSkillLevelGroup
                            GCATest={userSkillType}
                            skillsData={profile?.UserAccount?.UserSkills}
                            proficiency="Beginner"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </Card>
          ) : (
            ""
          )
        )}

      {userSkillTag.length > 0 ? (
        <div className="">
          <Card className="mb-4 p-5">
            <div className="col-md-12 mt-2 mb-2 ">
              <h5>
                <b>Skill Tags</b>
              </h5>
              <hr className="mt-3" />
              {userSkillTag.map((skills, index) => (
                <>
                  <>
                    <p key={index} className="badge job-badge">
                      <b>#{skills?.name?.replace("&amp;", "&")}</b>
                    </p>
                  </>
                </>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        ""
      )}

      {profileData &&
        profileData?.map((profile) =>
          profile?.UserAccount?.Experiences.length > 0 ? (
            <div className="">
              <Card className="mb-4 p-5">
                <div className="col-md-12 mt-2 mb-2 ">
                  <h5>
                    <b>Experience</b>
                  </h5>
                  <hr className="mt-3" />
                  {profile.UserAccount.Experiences.map((edu) => (
                    <>
                      <div
                        className="col-md-12 applicantDetailsExp"
                        style={{ marginRight: "40px" }}
                      >
                        <div className="expTitle">
                          <p className="bodyTitles">
                            <b>{edu.position}</b>
                          </p>
                          <p className="exdivider">-</p>
                          <p className="bodyTitles">
                            <b>{edu.company}</b>
                          </p>
                        </div>
                        <p>
                          {moment(`${edu.from}`).format("Do MMMM YYYY")} -{" "}
                          {moment(`${edu.to}`).format("Do MMMM YYYY")}
                        </p>
                      </div>
                      <p style={{ marginTop: "-10px" }}>
                        {edu.city != null || "" ? edu.city : "Not provided"}
                      </p>
                      <p style={{ marginTop: "-10px" }}>
                        {ReactHtmlParser(edu.responsibilities)}
                      </p>
                      <hr className="mt-4" />
                    </>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            ""
          )
        )}

      {profileData &&
        profileData?.map((profile) =>
          profile?.UserAccount?.Certifications.length > 0 ? (
            <div className="">
              <Card className="mb-4 p-5">
                <div className="col-md-12 mt-2 detailscard">
                  <p className="bodyTitles">
                    <b>Certification</b>
                  </p>
                </div>

                <hr className="mt-3" />

                {profile?.UserAccount?.Certifications.map((edu) => {
                  return (
                    <>
                      <div
                        className="col-md-12 applicantDetailsExp"
                        style={{ marginRight: "40px" }}
                        key={edu.id}
                      >
                        <div className="expTitle">
                          <p className="bodyTitles">
                            <b>{edu.certificate}</b>
                          </p>
                          <p className="exdivider">-</p>
                          <p className="bodyTitles">
                            <b>{edu.issuing_authority}</b>
                          </p>
                        </div>
                        <p>
                          {moment(`${edu.issue_date}`).format("Do MMMM YYYY")} -{" "}
                          {moment(`${edu.valid_till}`).format("Do MMMM YYYY")}
                        </p>
                      </div>
                      <a href={"//" + edu.link} target="_blank">
                        {edu.link !== null || ""
                          ? "Click here to view certificate"
                          : ""}{" "}
                      </a>
                      <hr className="mt-4" />
                    </>
                  );
                })}
              </Card>
            </div>
          ) : (
            ""
          )
        )}

      {profileData &&
        profileData?.map((profile) =>
          profile?.JobApplicationFiles?.length > 0 ? (
            <div className="">
              <Card className="mb-4 p-5">
                <div className="col-md-12 mt-2">
                  <p className="bodyTitles">Attachments</p>
                  <hr className="mt-3" />
                </div>
                <div className="row">
                  {profile?.JobApplicationFiles?.map((oneFile) => {
                    return (
                      <div
                        key={oneFile.id}
                        className="col-md-2 text-center mb-3 mt-2"
                      >
                        <div className="file">
                          <div className="content">
                            {oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "xlsx" ||
                            oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "xls" ||
                            oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "csv" ? (
                              <div>
                                <img
                                  src="/images/new-excel.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "docs" ||
                              oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "docx" ? (
                              <>
                                <img
                                  src="/images/msword.png"
                                  width={90}
                                  height={100}
                                />
                              </>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "pdf" ? (
                              <div>
                                <img
                                  src="/images/pdf.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "ppt" ||
                              oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "pptx" ? (
                              <div>
                                <img
                                  src="/images/ppt.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "jpeg" ||
                              oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "jpg" ||
                              oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "png" ||
                              oneFile?.name?.split("/")[3]?.split(".")[1] ===
                                "jfif" ? (
                              <div>
                                <img
                                  src={oneFile.name}
                                  width={120}
                                  height={100}
                                  style={{ borderRadius: "5px" }}
                                />
                              </div>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "psd" ? (
                              <div>
                                <img
                                  src="/images/new-psd.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "xd" ? (
                              <div>
                                <img
                                  src="/images/new-xd.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "fig" ? (
                              <div>
                                <img
                                  src="/images/new-fig.jpg"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : oneFile?.name?.split("/")[3]?.split(".")[1] ===
                              "mp4" ? (
                              <div>
                                <img
                                  src="/images/new-mp4.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : (
                              <div>
                                <img
                                  src="/images/default-file.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            )}
                          </div>
                          <div className="d-flex hoverButtons">
                            <div title="Download">
                              <a href={oneFile.name} download>
                                <CloudDownloadOutlinedIcon
                                  color="primary"
                                  type="button"
                                />
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="shorten-filename mt-2">
                          <p style={{ textTransform: "capitalize" }}>
                            {oneFile?.splitName}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ) : (
            ""
          )
        )}

      {profileData &&
        profileData?.map((profile) =>
          profile?.JobApplicationAnswers?.length > 0 ? (
            <div className="" id=" detailscard">
              <Card className="mb-4 p-5">
                <p className="bodyTitles">Interview Answers</p>
                <hr className="mt-1" />

                <div className="col-md-12">
                  {profile?.JobApplicationAnswers?.map((answers) => (
                    <>
                      <p>{answers?.Question.question}</p>
                      <p style={{ color: "#555555" }}>{answers?.answer}</p>
                      <hr className="mt-5" />
                    </>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            ""
          )
        )}

      {profileData &&
        profileData?.map((profile) =>
          profile?.UserAccount?.Portfolios?.length > 0 ? (
            <Card className="mb-5 p-5">
              <p className="bodyTitles">Portfolios</p>
              <hr className="mt-1" />
              <div className="row">
                {profile?.UserAccount?.Portfolios?.map((oneFile) =>
                  oneFile?.PortfolioFiles?.map((one) => {
                    return (
                      <div
                        key={oneFile.id}
                        className="col-md-2 text-center mb-3 mt-2"
                      >
                        <div className="file mb-3">
                          <div className="content">
                            {one?.name?.split("/")[3].split(".")[1] ===
                              "xlsx" ||
                            one?.name?.split("/")[3].split(".")[1] === "xls" ||
                            one?.name?.split("/")[3].split(".")[1] === "csv" ? (
                              <div>
                                <img
                                  src="/images/new-excel.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                                "docs" ||
                              one?.name?.split("/")[3].split(".")[1] ===
                                "docx" ? (
                              <>
                                <img
                                  src="/images/msword.png"
                                  width={90}
                                  height={100}
                                />
                              </>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                              "pdf" ? (
                              <div>
                                <img
                                  src="/images/pdf.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                                "ppt" ||
                              one?.name?.split("/")[3].split(".")[1] ===
                                "pptx" ? (
                              <div>
                                <img
                                  src="/images/ppt.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                                "jpeg" ||
                              one?.name?.split("/")[3].split(".")[1] ===
                                "jpg" ||
                              one?.name?.split("/")[3].split(".")[1] ===
                                "png" ||
                              one?.name?.split("/")[3].split(".")[1] ===
                                "jfif" ? (
                              <div>
                                <img
                                  src={one.name}
                                  width={120}
                                  height={100}
                                  style={{ borderRadius: "5px" }}
                                />
                              </div>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                              "psd" ? (
                              <div>
                                <img
                                  src="/images/new-psd.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                              "xd" ? (
                              <div>
                                <img
                                  src="/images/new-xd.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                              "fig" ? (
                              <div>
                                <img
                                  src="/images/new-fig.jpg"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            ) : one?.name?.split("/")[3].split(".")[1] ===
                              "mp4" ? (
                              <div>
                                <video width="320" height="240" controls>
                                  <source src={one.name} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div>
                                <img
                                  src="/images/default-file.png"
                                  width={90}
                                  height={100}
                                />
                              </div>
                            )}
                          </div>
                          <div className="d-flex hoverButtons">
                            <div title="Download">
                              <a href={one.name} download>
                                <CloudDownloadOutlinedIcon
                                  color="primary"
                                  type="button"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                        <a
                          className="btn-text"
                          href={one?.name}
                          rel="noreferrer"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "#555555",
                          }}
                        >
                          {oneFile.title}
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          ) : (
            ""
          )
        )}
    </div>
  );
};
export default ApplicantDetails;
