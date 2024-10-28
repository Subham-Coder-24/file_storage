import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.user.id;

    // Step 1: Create the workspace and set the logged-in user as the admin
    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        adminId,
      },
    });

    // Step 2: Create the WorkspaceMember record for the admin
    await prisma.workspaceMember.create({
      data: {
        userId: adminId,
        workspaceId: newWorkspace.id,
        role: "ADMIN", // Set the admin role
      },
    });

    res.status(201).json({
      message: "Workspace created successfully",
      workspace: newWorkspace,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create workspace", error: error.message });
  }
};

const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user.id` is the ID of the logged-in user

    // Step 1: Retrieve workspace IDs from WorkspaceMember where the user is a member
    const workspaceMemberships = await prisma.workspaceMember.findMany({
      where: {
        userId,
      },
      select: {
        workspaceId: true,
      },
    });

    // Extract all workspace IDs into an array
    const workspaceIds = workspaceMemberships.map(
      (membership) => membership.workspaceId
    );

    // Step 2: Fetch workspace details using the workspace IDs
    const userWorkspaces = await prisma.workspace.findMany({
      where: {
        id: { in: workspaceIds },
      },
      include: {
        members: true, // Optional: Include member details
        admin: true, // Optional: Include admin details
      },
    });

    res.status(200).json({ workspaces: userWorkspaces });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch workspaces", error: error.message });
  }
};

export { createWorkspace, getUserWorkspaces };
