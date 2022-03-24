import { mdiCheckboxMarkedCircle } from "@mdi/js";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Icon from "@mdi/react";



const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: 11,
      position: "relative",
      top: "-15px",
      right: "-10px"
    },
  }));


 const CertifiedSkillBadge = ({ skillname }) => {
    return (
      <>
      <LightTooltip title="Certified" placement="bottom-end">
        <p className="badge job-badge-skill" style={{marginBottom: "18px"}}>
          {skillname}{" "}
          <Icon
            path={mdiCheckboxMarkedCircle}
            size={0.7}
            horizontal
            vertical
            color="#009E20"
            rotate={180}
            style={{ marginBottom: "1px" }}
          />{" "}
        </p>
        </LightTooltip>
      </>
    );
  };
  
   const NonCertifiedSkillBadge = ({ skillname }) => {
    return (
      <>
        <p className=" badge job-badge" style={{marginBottom: "18px"}}>
          {skillname}
        </p>
      </>
    );
  };
  
  export const SkillLevelGroup = ({ GCATest, skillsData, proficiency }) => {
    return (
      <>
        {GCATest?.map((GCA, index) => {
          return (
            <>
              {GCA?.isCertified && (GCA?.proficiency === proficiency) && <CertifiedSkillBadge skillname={GCA?.name} />}
            </>
          );
        })}
        {skillsData?.map((skills, index) => {
          return (
            <>
              {((skills.certifyCategory && skills?.proficiency === proficiency) ||
                (skills?.certifySkill && skills?.proficiency === proficiency) ||
                (skills?.certifyIndustry && skills?.proficiency === proficiency) ||
                (skills?.certifySubIndustry && skills?.proficiency === proficiency)) && (
                <CertifiedSkillBadge
                  skillname={
                    skills?.subCategory?.name
                      ? skills?.subCategory?.name
                      : skills?.subCategory?.category
                  }
                />
              )}
            </>
          );
        })}
  
        {GCATest?.map((GCA, index) => {
          return (
            <>
              {!GCA.isCertified && (
                <NonCertifiedSkillBadge skillname={GCA?.name} />
              )}
            </>
          );
        })}
  
        {skillsData?.map((skills, index) => {
          return (
            <>
              {(!skills.certifyCategory && skills?.proficiency === proficiency) &&
                (!skills?.certifySkill && skills?.proficiency === proficiency) &&
                (!skills?.certifyIndustry && skills?.proficiency === proficiency) &&
                (!skills?.certifySubIndustry && skills?.proficiency === proficiency) && (
                  <NonCertifiedSkillBadge
                    skillname={
                      skills?.subCategory?.name
                        ? skills?.subCategory?.name
                        : skills?.subCategory?.category
                    }
                  />
                )}
            </>
          );
        })}
      </>
    );
  };



  export const AppliDetailsSkillLevelGroup = ({ GCATest, skillsData, proficiency }) => {
    return (
      <>
        {GCATest?.map((GCA, index) => {
          return (
            <>
              {GCA?.isCertified && (GCA?.proficiency === proficiency) && <CertifiedSkillBadge skillname={GCA?.name} />}
            </>
          );
        })}
        {skillsData?.map((skills, index) => {
          return (
            <>
              {((skills.certifySkill && skills?.proficiency === proficiency) ||
                (skills?.certifyCategory && skills?.proficiency === proficiency)) && (
                <CertifiedSkillBadge
                  skillname={
                    skills?.SubCategory.category
                  }
                />
              )}
            </>
          );
        })}
  
        {GCATest?.map((GCA, index) => {
          return (
            <>
              {!GCA.isCertified && (
                <NonCertifiedSkillBadge skillname={GCA?.name} />
              )}
            </>
          );
        })}
  
        {skillsData?.map((skills, index) => {
          return (
            <>
              {(!skills.certifySkill && skills?.proficiency === proficiency) &&
                (!skills?.certifyCategory && skills?.proficiency === proficiency) && (
                  <NonCertifiedSkillBadge
                    skillname={
                      skills?.SubCategory.category
                    }
                  />
                )}
            </>
          );
        })}
      </>
    );
  };