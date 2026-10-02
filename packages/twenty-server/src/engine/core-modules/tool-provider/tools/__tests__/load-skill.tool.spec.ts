import { createLoadSkillTool } from 'src/engine/core-modules/tool-provider/tools/load-skill.tool';

const mockAvailableSkillNames = ['workflow-building', 'data-manipulation'];

describe('createLoadSkillTool', () => {
  it('returns a helpful message when skillNames is missing', async () => {
    const loadSkills = jest.fn();
    const listAvailableSkillNames = jest
      .fn()
      .mockResolvedValue(mockAvailableSkillNames);
    const tool = createLoadSkillTool(loadSkills, listAvailableSkillNames);

    const result = await tool.execute({} as never);

    expect(loadSkills).not.toHaveBeenCalled();
    expect(listAvailableSkillNames).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      skills: [],
      message:
        'Invalid load_skills arguments. Expected { "skillNames": ["workflow-building", "data-manipulation"] }. Available skills: workflow-building, data-manipulation.',
    });
  });

  it('loads skills by name', async () => {
    const loadSkills = jest.fn().mockResolvedValue([
      {
        name: 'workflow-building',
        label: 'Workflow Building',
        content: 'Workflow instructions',
      },
    ]);
    const listAvailableSkillNames = jest.fn();
    const tool = createLoadSkillTool(loadSkills, listAvailableSkillNames);

    const result = await tool.execute({
      skillNames: ['workflow-building'],
    });

    expect(loadSkills).toHaveBeenCalledWith(['workflow-building']);
    expect(listAvailableSkillNames).not.toHaveBeenCalled();
    expect(result).toEqual({
      skills: [
        {
          name: 'workflow-building',
          label: 'Workflow Building',
          content: 'Workflow instructions',
        },
      ],
      message: 'Loaded Workflow Building',
    });
  });
});
