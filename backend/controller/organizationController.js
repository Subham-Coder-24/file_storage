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

const getOrganizationFiles = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.id; // Assuming req.user.id holds the logged-in user's ID

    // Step 1: Check if the user is a member of the specified organization
    const isMember = await prisma.workspaceMember.findFirst({
      where: {
        userId: userId,
        workspaceId: organizationId,
      },
    });

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Access denied. Not a member of this organization." });
    }

    // Step 2: Get all user IDs who are members of the same organization
    const memberIds = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: organizationId,
      },
      select: {
        userId: true,
      },
    });

    const userIds = memberIds.map((member) => member.userId);

    // Step 3: Fetch all files owned by these users
    const files = await prisma.file.findMany({
      where: {
        ownerId: {
          in: userIds,
        },
      },
    });

    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching organization files:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch files", error: error.message });
  }
};

export { createWorkspace, getUserWorkspaces, getOrganizationFiles };
