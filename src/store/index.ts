import { create } from "zustand";
import produce, { current } from "immer";

import frontendData from "~/data/frontend";
import backendData from "~/data/backend";
import infraData from "~/data/infra";
import toolsData from "~/data/tools";
import jobsData from "~/data/jobs";

interface skillsI {
  data: {
    skills: {
      frontend: Array<any>;
      backend: Array<any>;
      infra: Array<any>;
      tools: Array<any>;
    };
    jobs: Array<any>;
    schools: Array<any>;
  };

  history: Array<any>;
  skillsActions: {
    remove: (key) => (index) => any;
    removeAll: () => any;
    showAll: () => any;
    reset: () => any;
  };
  jobsActions: {
    remove: (index) => any;
    showAll: () => any;
    reset: () => any;
    addSkills: (clear) => (tools) => any;
  };

  reset: () => any;
  showAll: () => any;
  undo: () => any;
}

const initialSkills = {
  frontend: frontendData.filter((skill) => skill.default),
  backend: backendData.filter((skill) => skill.default),
  infra: infraData.filter((skill) => skill.default),
  tools: toolsData.filter((skill) => skill.default),
};

const initialJobs = jobsData.filter((skill) => skill.default);

const useSkillsStore = create<skillsI>((set) => ({
  data: {
    skills: initialSkills,
    jobs: initialJobs,
    schools: [],
  },

  history: [],
  jobsActions: {
    remove: (index) =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.jobs = state.data.jobs.filter((_, i) => i !== index);
        })
      ),

    showAll: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.jobs = jobsData;
        })
      ),
    reset: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.jobs = initialJobs;
        })
      ),
    addSkills: (tools) => (clear) =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills.frontend = frontendData.filter(
            (item) =>
              tools.includes(item.label) ||
              (clear &&
                state.data.skills.frontend
                  .map((i) => i.label)
                  .includes(item.label))
          );

          state.data.skills.backend = backendData.filter(
            (item) =>
              tools.includes(item.label) ||
              (clear &&
                state.data.skills.backend
                  .map((i) => i.label)
                  .includes(item.label))
          );

          state.data.skills.infra = infraData.filter(
            (item) =>
              tools.includes(item.label) ||
              (clear &&
                state.data.skills.infra
                  .map((i) => i.label)
                  .includes(item.label))
          );

          state.data.skills.tools = toolsData.filter(
            (item) =>
              tools.includes(item.label) ||
              (clear &&
                state.data.skills.tools
                  .map((i) => i.label)
                  .includes(item.label))
          );
        })
      ),
  },
  skillsActions: {
    remove: (key) => (index) =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills[key] = state.data.skills[key].filter(
            (_, i) => i !== index
          );
        })
      ),

    showAll: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills.frontend = frontendData;
          state.data.skills.backend = backendData;
          state.data.skills.infra = infraData;
          state.data.skills.tools = toolsData;
        })
      ),
    removeAll: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills = {
            frontend: [],
            backend: [],
            infra: [],
            tools: [],
          };
        })
      ),
    reset: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills = initialSkills;
        })
      ),
  },
  reset: () =>
    set(
      produce((state) => {
        state.history.push(current(state.data));
        state.data.skills = initialSkills;
        state.data.jobs = initialJobs;
      })
    ),
  showAll: () =>
    set(
      produce((state) => {
        state.history.push(current(state.data));
        state.data.skills.frontend = frontendData;
        state.data.skills.backend = backendData;
        state.data.skills.infra = infraData;
        state.data.skills.tools = toolsData;
        state.data.jobs = jobsData;
      })
    ),
  undo: () =>
    set(
      produce((state) => {
        if (state.history.length > 0) {
          state.data = state.history.pop();
        }
      })
    ),
}));

export default useSkillsStore;
