import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CodeIcon from "@mui/icons-material/Code";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiCplusplus,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiMysql,
  SiJava,
  SiTypescript,
  SiGo,
  SiRust,
  SiRuby,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiDart,
  SiTensorflow,
  SiPytorch,
  SiKeras,
  SiScikitlearn,
  SiPandas,
  SiOpencv,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiDjango,
  SiFlask,
  SiSpringboot,
  SiLaravel,
  SiExpress,
  SiFlutter,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiLinux,
  SiTailwindcss
} from "react-icons/si";
import SectionCard from "@/components/ui/section-card";
import type { JnfFieldErrors } from "../lib/jnf-validation";
import type { JnfRecord } from "../types";
import JnfFormGrid from "./jnf-form-grid";
import { jnfFunctionalAreaOptions } from "../data/jnf-functional-areas";
import { getSkillsCatalog } from "../lib/jnf-api";

const filter = createFilterOptions<string>();

const getSkillIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("react")) return <SiReact />;
  if (lower.includes("node")) return <SiNodedotjs />;
  if (lower.includes("python")) return <SiPython />;
  if (lower.includes("c++")) return <SiCplusplus />;
  if (lower.includes("javascript") || lower === "js") return <SiJavascript />;
  if (lower.includes("typescript") || lower === "ts") return <SiTypescript />;
  if (lower.includes("html")) return <SiHtml5 />;
  if (lower.includes("css")) return <SiCss3 />;
  if (lower.includes("tailwind")) return <SiTailwindcss />;
  if (lower.includes("sql")) return <SiMysql />;
  if (lower.includes("postgres")) return <SiPostgresql />;
  if (lower.includes("mongo")) return <SiMongodb />;
  if (lower.includes("java") && !lower.includes("javascript")) return <SiJava />;
  if (lower === "go" || lower === "golang") return <SiGo />;
  if (lower.includes("rust")) return <SiRust />;
  if (lower.includes("ruby")) return <SiRuby />;
  if (lower.includes("php")) return <SiPhp />;
  if (lower.includes("swift")) return <SiSwift />;
  if (lower.includes("kotlin")) return <SiKotlin />;
  if (lower.includes("dart")) return <SiDart />;
  if (lower.includes("tensorflow") || lower === "tf") return <SiTensorflow />;
  if (lower.includes("pytorch")) return <SiPytorch />;
  if (lower.includes("keras")) return <SiKeras />;
  if (lower.includes("scikit")) return <SiScikitlearn />;
  if (lower.includes("pandas")) return <SiPandas />;
  if (lower.includes("opencv")) return <SiOpencv />;
  if (lower.includes("next")) return <SiNextdotjs />;
  if (lower.includes("vue")) return <SiVuedotjs />;
  if (lower.includes("angular")) return <SiAngular />;
  if (lower.includes("svelte")) return <SiSvelte />;
  if (lower.includes("django")) return <SiDjango />;
  if (lower.includes("flask")) return <SiFlask />;
  if (lower.includes("spring")) return <SiSpringboot />;
  if (lower.includes("laravel")) return <SiLaravel />;
  if (lower.includes("express")) return <SiExpress />;
  if (lower.includes("flutter")) return <SiFlutter />;
  if (lower.includes("docker")) return <SiDocker />;
  if (lower.includes("kubernetes") || lower === "k8s") return <SiKubernetes />;
  if (lower.includes("git")) return <SiGit />;
  if (lower.includes("linux")) return <SiLinux />;

  return <CodeIcon />;
};

type JnfJobProfileSectionProps = Readonly<{
  form: JnfRecord;
  setForm: React.Dispatch<React.SetStateAction<JnfRecord>>;
  fieldErrors: JnfFieldErrors;
  embedded?: boolean;
}>;

const roleTypeOptions = [
  { value: "full_time", label: "Full Time" },
  { value: "internship", label: "Internship" },
  { value: "internship_ppo", label: "Internship + PPO" },
  { value: "contract", label: "Contract" },
  { value: "other", label: "Other" },
] as const;

const workModeOptions = [
  { value: "on_site", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
] as const;

export default function JnfJobProfileSection({
  form,
  setForm,
  fieldErrors,
  embedded = false,
}: JnfJobProfileSectionProps) {
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillInputValue, setSkillInputValue] = useState("");

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await getSkillsCatalog();
        setSkillOptions(response.data.skills.map((s) => s.label));
      } catch (error) {
        console.error("Failed to fetch skills catalog", error);
      } finally {
        setLoadingSkills(false);
      }
    }
    fetchSkills();
  }, []);

  const content = (
    <Stack spacing={2.5}>
      <JnfFormGrid>
        <TextField
          label="Recruitment Season"
          required
          placeholder="e.g. 2026-27"
          value={form.recruitment_season}
          error={Boolean(fieldErrors["recruitment_season"])}
          helperText={fieldErrors["recruitment_season"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              recruitment_season: event.target.value,
            }))
          }
          fullWidth
        />

        <TextField
          label="Job Title"
          required
          placeholder="e.g. Software Development Engineer"
          value={form.job_title}
          error={Boolean(fieldErrors["job_title"])}
          helperText={fieldErrors["job_title"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              job_title: event.target.value,
            }))
          }
          fullWidth
        />

        <TextField
          label="Job Designation"
          required
          placeholder="e.g. SDE-1"
          value={form.job_designation}
          error={Boolean(fieldErrors["job_designation"])}
          helperText={fieldErrors["job_designation"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              job_designation: event.target.value,
            }))
          }
          fullWidth
        />

        <TextField
          select
          label="Department / Function"
          value={form.department_or_function}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              department_or_function: event.target.value,
            }))
          }
          fullWidth
        >
          {jnfFunctionalAreaOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          select
          label="Role Type"
          required
          value={form.role_type}
          error={Boolean(fieldErrors["role_type"])}
          helperText={fieldErrors["role_type"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              role_type: event.target.value as JnfRecord["role_type"],
            }))
          }
          fullWidth
        >
          {roleTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Work Mode"
          required
          value={form.work_location_mode}
          error={Boolean(fieldErrors["work_location_mode"])}
          helperText={fieldErrors["work_location_mode"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              work_location_mode: event.target.value as JnfRecord["work_location_mode"],
            }))
          }
          fullWidth
        >
          {workModeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Place of Posting"
          required
          placeholder="e.g. Bengaluru"
          value={form.place_of_posting}
          error={Boolean(fieldErrors["place_of_posting"])}
          helperText={fieldErrors["place_of_posting"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              place_of_posting: event.target.value,
            }))
          }
          fullWidth
        />

        <TextField
          label="Tentative Joining Month"
          required
          type="month"
          value={form.tentative_joining_month}
          error={Boolean(fieldErrors["tentative_joining_month"])}
          helperText={fieldErrors["tentative_joining_month"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              tentative_joining_month: event.target.value,
            }))
          }
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Expected Hires"
          required
          type="number"
          value={form.expected_hires}
          error={Boolean(fieldErrors["expected_hires"])}
          helperText={fieldErrors["expected_hires"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              expected_hires:
                event.target.value === "" ? "" : Number(event.target.value),
            }))
          }
          fullWidth
        />

        <TextField
          label="Minimum Hires"
          type="number"
          value={form.minimum_hires}
          error={Boolean(fieldErrors["minimum_hires"])}
          helperText={fieldErrors["minimum_hires"]}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              minimum_hires:
                event.target.value === "" ? "" : Number(event.target.value),
            }))
          }
          fullWidth
        />

        <Autocomplete
          multiple
          freeSolo
          options={skillOptions}
          loading={loadingSkills}
          filterOptions={(options, params) => {
            if (params.inputValue.trim() === '') {
              return [];
            }
            return filter(options, params);
          }}
          value={form.required_skills}
          inputValue={skillInputValue}
          onInputChange={(event, newInputValue, reason) => {
            if (reason === "input" && newInputValue.endsWith(",")) {
              const val = newInputValue.slice(0, -1).trim();
              if (val && !form.required_skills.includes(val)) {
                setForm((current) => ({
                  ...current,
                  required_skills: [...current.required_skills, val],
                }));
              }
              setSkillInputValue("");
            } else if (reason !== "reset") {
              setSkillInputValue(newInputValue);
            } else {
              setSkillInputValue("");
            }
          }}
          onChange={(event, newValue) => {
            setForm((current) => ({
              ...current,
              required_skills: newValue as string[],
            }));
            setSkillInputValue("");
          }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  {...tagProps}
                  label={option}
                  icon={getSkillIcon(option)}
                  sx={{ pl: 0.5 }}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Required Skills"
              placeholder=""
              helperText="Type a skill and press Enter."
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingSkills ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </JnfFormGrid>

      <TextField
        label="Job Description"
        required
        value={form.job_description_html}
        error={Boolean(fieldErrors["job_description_html"])}
        helperText={
          fieldErrors["job_description_html"] ??
          "This field is required before final submission."
        }
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            job_description_html: event.target.value,
          }))
        }
        multiline
        minRows={5}
        fullWidth
      />

      <TextField
        label="Additional Job Information"
        value={form.additional_job_info}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            additional_job_info: event.target.value,
          }))
        }
        multiline
        minRows={4}
        fullWidth
      />
    </Stack>
  );

  if (embedded) {
    return content;
  }

  return (
    <SectionCard
      title="Job Profile"
      description="Add the role details, hiring plan, skills, and core job description."
    >
      {content}
    </SectionCard>
  );
}
