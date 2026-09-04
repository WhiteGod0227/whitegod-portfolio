const getProjects = async (req, res, next) => {
  try {
    const projects = [
      {
        id: 'green-tech',
        arc: 'Arc I — Featured',
        title: 'Green-Tech',
        icon: '🌿',
        description:
          'A web platform focused on sustainability and green technology awareness. Built with a modern, responsive UI to spread eco-conscious ideas through a clean digital experience.',
        techStack: ['React', 'Tailwind CSS', 'JavaScript', 'GitHub'],
        githubUrl: 'https://github.com/WhiteGod0227/Green-Tech',
        liveUrl: null,
        isFeatured: true,
      },
      {
        id: 'healthcare-main',
        arc: 'Arc II',
        title: 'Healthcare Main',
        icon: '🏥',
        description:
          'A healthcare web app for managing medical information with a clean, dashboard-style UI focused on clarity and accessibility of health data.',
        techStack: ['React', 'Tailwind CSS', 'JavaScript'],
        githubUrl: 'https://github.com/WhiteGod0227/healthcare-main',
        liveUrl: null,
        isFeatured: false,
      },
      {
        id: 'swasth-saarthi',
        arc: 'Arc III',
        title: 'Swasth-Saarthi',
        icon: '💊',
        description:
          'A health assistance platform to help users access basic healthcare features and essential wellness information in a simple, approachable interface.',
        techStack: ['React', 'Tailwind CSS', 'JavaScript'],
        githubUrl: 'https://github.com/WhiteDevil1247/Swasth-Saarthi-Main',
        liveUrl: null,
        isFeatured: false,
      },
    ];

    const reels = [
      {
        id: 1,
        code: '01',
        title: 'Cut',
        label: 'Boys vs Girls Hug Me Prank',
        poster: 'assets/reels/reel1.jpg',
        url: 'https://www.instagram.com/reel/DcbEZmeSufR/?igsi=MW55cGpzdnByeTg0Zw==',
      },
      {
        id: 2,
        code: '02',
        title: 'Sync',
        label: 'Boys Date For Girls',
        poster: 'assets/reels/reel2.jpg',
        url: 'https://www.instagram.com/reel/Db3EKrQS-oA/?igsi=MXRhdm85dXl3ZzhwaA==',
      },
      {
        id: 3,
        code: '03',
        title: 'FX',
        label: 'Random Clips of Unplanned Trip',
        poster: 'assets/reels/reel3.jpg',
        url: 'https://drive.google.com/drive/mobile/folders/1Aq3Te9uTjsROOp90ac8fxn__7AhY_EqU?fbclid=PAVERTVgT_cqhwZG9mAmV4dG4DYWVtAjEwAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp6adZEb3qkw9D5itqtMw_zEjJeMSVH9MGNSmf-pEOVTdkeBhbdWzoaZ36pPY_aem_1WPsf_ztc_5vIfTb3yaXuw',
      },
      {
        id: 4,
        code: '04',
        title: 'Drop',
        label: 'Internship Guidance Course',
        poster: 'assets/reels/reel4.jpg',
        url: 'https://drive.google.com/drive/mobile/folders/1Aq3Te9uTjsROOp90ac8fxn__7AhY_EqU?fbclid=PAVERTVgT_cqhwZG9mAmV4dG4DYWVtAjEwAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp6adZEb3qkw9D5itqtMw_zEjJeMSVH9MGNSmf-pEOVTdkeBhbdWzoaZ36pPY_aem_1WPsf_ztc_5vIfTb3yaXuw',
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        projects,
        reels,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
};
