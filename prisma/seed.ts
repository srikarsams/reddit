import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

function timePlus(duration = 0) {
  const time = new Date('2020-11-07 07:01:43.18').getTime();

  return new Date(time + duration).toISOString();
}

async function main() {
  try {
    const password = await bcrypt.hash('123456', 6);
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    console.log('⛔️ Deleting users....');
    await db.user.deleteMany();

    const users = [
      {
        username: 'john',
        email: 'john@email.com',
        password,
        createdAt: timePlus(),
        updatedAt: timePlus(),
      },
      {
        username: 'jane',
        email: 'jane@email.com',
        password,
        createdAt: timePlus(minute * 5),
        updatedAt: timePlus(minute * 5),
      },
    ];

    console.log('🕺 Creating users....');
    await Promise.all(
      users.map((user) => {
        return db.user.create({
          data: user,
        });
      })
    );

    const john = await db.user.findUnique({ where: { username: 'john' } });
    const jane = await db.user.findUnique({ where: { username: 'jane' } });

    const subs = [
      {
        name: 'reactjs',
        description: 'A group of React JS fanboys',
        creator: {
          connect: {
            username: john?.username || 's',
          },
        },
        createdAt: timePlus(minute * 20),
      },
      {
        name: 'funny',
        description: 'If you cant joke your life is a joke',
        creator: {
          connect: {
            username: jane?.username || 's',
          },
        },
        createdAt: timePlus(minute * 25),
      },
      {
        name: 'InsightfulQuestions',
        description: "Questions that make you go 'Ohhh'",
        creator: {
          connect: {
            username: john?.username || 's',
          },
        },
        createdAt: timePlus(minute * 30),
      },
      {
        name: 'oneliners',
        description:
          'A variety of funny, one line jokes in a well-moderated, friendly community!',
        creator: {
          connect: {
            username: john?.username || 's',
          },
        },
        createdAt: timePlus(hour),
      },
      {
        name: 'readyplayerone',
        description: 'Your nexus for all things Ready Player One',
        creator: {
          connect: {
            username: jane?.username || 's',
          },
        },
        createdAt: timePlus(hour),
      },
      {
        name: 'reallyannoyingsounds',
        description: 'Ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
        creator: {
          connect: {
            username: john?.username || 's',
          },
        },
      },
    ];

    console.log('📤 Creating subs...');
    await db.sub.create({
      data: subs[0],
    });
    await db.sub.create({
      data: subs[1],
    });
    await db.sub.create({
      data: subs[2],
    });
    await db.sub.create({
      data: subs[3],
    });
    await db.sub.create({
      data: subs[4],
    });
    await db.sub.create({
      data: subs[5],
    });

    const reactJsSub = await db.sub.findUnique({ where: { name: 'reactjs' } });
    const funnySub = await db.sub.findUnique({ where: { name: 'funny' } });
    const iqSub = await db.sub.findUnique({
      where: { name: 'InsightfulQuestions' },
    });
    const oneliners = await db.sub.findUnique({ where: { name: 'oneliners' } });

    const posts = [
      {
        // id: 1
        title: 'React 17 is out!!',
        slug: 'react_17_is_out',
        body: 'But it has no new features...',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: reactJsSub?.name || 's',
          },
        },
        createdAt: timePlus(minute * 20),
        updatedAt: timePlus(minute * 20),
      },
      {
        // id: 2
        title: 'Comparing Redux to Vue composition API',
        slug: 'comparing_redux_to_vue_composition_api',
        body: 'It feels like Redux is too much boilerplate',
        author: {
          connect: {
            username: jane?.username || 's',
          },
        },
        sub: {
          connect: {
            name: reactJsSub?.name || 's',
          },
        },
        createdAt: timePlus(hour),
        updatedAt: timePlus(hour),
      },
      {
        // id: 3
        title: "What's your favourite React component library?",
        slug: 'whats_your_favourite_react_component_library',
        body: '(title) Mine is @material-ui',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: reactJsSub?.name || 's',
          },
        },
        createdAt: timePlus(hour + minute * 30),
        updatedAt: timePlus(hour + minute * 30),
      },
      {
        // id: 4
        title:
          'What is the difference between healthy venting and shit talking?',
        slug: 'what_is_the_difference_between_healthy_venting_and_shit_talking',
        body: 'What exactly does “talking behind your back” mean? When does giving an aggressive rant to a friend become disloyalty? Gossip?',
        author: {
          connect: {
            username: jane?.username || 's',
          },
        },
        sub: {
          connect: {
            name: iqSub?.name || 's',
          },
        },
        createdAt: timePlus(minute * 40),
        updatedAt: timePlus(minute * 40),
      },
      {
        // id: 5
        title:
          "What's the most difficult thing when you try to change your job?",
        slug: 'whats_the_most_difficult_thing_when_you_try_to_change_your_job',
        body: `This 2020 was a hard year for everyone, on June 2, my first son born.
                    I've too much stuff in my mind at this moment and one of them is finding a new job. My question is,
                    what's the most difficult thing when you try to change your job? I'm still in my comfort zone and I'm scared,
                    any advice to help me to take the step?`,
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: iqSub?.name || 's',
          },
        },
        createdAt: timePlus(hour + minute * 40),
        updatedAt: timePlus(hour + minute * 40),
      },
      {
        // id: 6
        title:
          'What was the most important social lesson you learned when you were younger?',
        slug: 'what_was_the_most_important_social_lesson_you_learned_when_you_were_younger',
        body: `I'm still relatively young, and I'm learning more and more about social situations and how people react to anything at all. I'd love to hear your advice and experiences that helped you.`,
        author: {
          connect: {
            username: jane?.username || 's',
          },
        },
        sub: {
          connect: {
            name: iqSub?.name || 's',
          },
        },
        createdAt: timePlus(3 * hour),
        updatedAt: timePlus(3 * hour),
      },
      {
        // id: 7
        title:
          'Why do cows never have any money? Because the farmers milk them dry!',
        slug: 'why_do_cows_never_have_any_money_because_the_farmers_milk_them_dry',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: funnySub?.name || 's',
          },
        },
        createdAt: timePlus(9 * day),
        updatedAt: timePlus(9 * day),
      },
      {
        // id: 8
        title:
          "You would think that taking off a snail's shell would make it move faster, but it actually just makes it more sluggish.",
        slug: 'you_would_think_that_taking_off_a_snails_shell_would_make_it_move_faster_but_it_actually_just_makes_it_more_sluggish',
        author: {
          connect: {
            username: jane?.username || 's',
          },
        },
        sub: {
          connect: {
            name: funnySub?.name || 's',
          },
        },
        createdAt: timePlus(10 * day),
        updatedAt: timePlus(10 * day),
      },
      {
        // id: 9
        title: 'I ate a clock yesterday, it was very time-consuming.',
        slug: 'i_ate_a_clock_yesterday_it_was_very_time_consuming',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: funnySub?.name || 's',
          },
        },
        createdAt: timePlus(10 * day + 2 * hour),
        updatedAt: timePlus(10 * day + 2 * hour),
      },
      {
        // id: 10
        title: 'What’s the best thing about Switzerland?',
        slug: 'whats_the_best_thing_about_switzerland',
        body: 'I don’t know, but the flag is a big plus.',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: funnySub?.name || 's',
          },
        },
        createdAt: timePlus(3 * day),
        updatedAt: timePlus(3 * day),
      },
      {
        // id: 11
        title: 'I invented a new word: Plagiarism!',
        slug: 'i_invented_a_new_word_plagiarism',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: funnySub?.name || 's',
          },
        },
        createdAt: timePlus(4 * day),
        updatedAt: timePlus(4 * day),
      },
      {
        // id: 12
        title:
          'Did you hear about the mathematician who’s afraid of negative numbers?',
        slug: 'did_you_hear_about_the_mathematician_whos_afraid_of_negative_numbers',
        body: 'He’ll stop at nothing to avoid them.',
        author: {
          connect: {
            username: jane?.username || 's',
          },
        },
        sub: {
          connect: {
            name: funnySub?.name || 's',
          },
        },
        createdAt: timePlus(5 * day),
        updatedAt: timePlus(5 * day),
      },
      {
        // id: 13
        title: 'Helvetica and Times New Roman walk into a bar',
        slug: 'helvetica_and_times_new_roman_walk_into_a_bar',
        body: '“Get out of here!” shouts the bartender. “We don’t serve your type.”',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: funnySub?.name || 's',
          },
        },
        createdAt: timePlus(6 * day),
        updatedAt: timePlus(6 * day),
      },
      {
        // id: 14
        title: 'Dove chocolate taste better than their soap.',
        slug: 'dove_chocolate_taste_better_than_their_soap',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: oneliners?.name || 's',
          },
        },
        createdAt: timePlus(day + hour),
        updatedAt: timePlus(day + hour),
      },
      {
        // id: 15
        title: 'Raisin Awareness',
        slug: 'raisin_awareness',
        body: "I've been telling everyone about the benefits of eating dried grapes -- it's all about raisin awareness.",
        author: {
          connect: {
            username: jane?.username || 's',
          },
        },
        sub: {
          connect: {
            name: oneliners?.name || 's',
          },
        },
        createdAt: timePlus(day + 2 * hour),
        updatedAt: timePlus(day + 2 * hour),
      },
      {
        // id: 16
        title:
          'Iron Man and War Machine are cool, but there’s a stark difference between them.',
        slug: 'iron_man_and_war_machine_are_cool_but_theres_a_stark_difference_between_them',
        author: {
          connect: {
            username: john?.username || 's',
          },
        },
        sub: {
          connect: {
            name: oneliners?.name || 's',
          },
        },
        createdAt: timePlus(day + 6 * hour),
        updatedAt: timePlus(day + 6 * hour),
      },
      {
        // id: 17
        title:
          'The adjective for metal is metallic, but not so for iron, which is ironic.',
        slug: 'the_adjective_for_metal_is_metallic_but_not_so_for_iron_which_is_ironic',
        author: {
          connect: {
            username: jane?.username || 's',
          },
        },
        sub: {
          connect: {
            name: oneliners?.name || 's',
          },
        },
        createdAt: timePlus(day + 8 * hour),
        updatedAt: timePlus(day + 8 * hour),
      },
    ];

    console.log('📩 Creating posts...');
    await db.post.create({
      data: posts[0],
    });
    await db.post.create({
      data: posts[1],
    });
    await db.post.create({
      data: posts[2],
    });
    await db.post.create({
      data: posts[3],
    });
    await db.post.create({
      data: posts[4],
    });
    await db.post.create({
      data: posts[5],
    });
    await db.post.create({
      data: posts[6],
    });
    await db.post.create({
      data: posts[7],
    });
    await db.post.create({
      data: posts[8],
    });
    await db.post.create({
      data: posts[9],
    });
    await db.post.create({
      data: posts[10],
    });
    await db.post.create({
      data: posts[11],
    });
    await db.post.create({
      data: posts[12],
    });
    await db.post.create({
      data: posts[13],
    });
    await db.post.create({
      data: posts[14],
    });
    await db.post.create({
      data: posts[15],
    });
    await db.post.create({
      data: posts[16],
    });

    const post6 = await db.post.findUnique({
      where: {
        slug: 'helvetica_and_times_new_roman_walk_into_a_bar',
      },
    });
    const post7 = await db.post.findUnique({
      where: {
        slug: 'what_is_the_difference_between_healthy_venting_and_shit_talking',
      },
    });
    const post8 = await db.post.findUnique({
      where: {
        slug: 'why_do_cows_never_have_any_money_because_the_farmers_milk_them_dry',
      },
    });
    const post9 = await db.post.findUnique({
      where: {
        slug: 'whats_the_best_thing_about_switzerland',
      },
    });

    const comments = [
      {
        body: "That' punny hahaha!!",
        postSlug: post7?.slug || 's',
        authorName: john?.username || 's',
        createdAt: timePlus(10 * day + 5 * hour),
        updatedAt: timePlus(10 * day + 5 * hour),
      },
      {
        body: 'Poor cows hahaha',
        postSlug: post7?.slug || 's',
        authorName: jane?.username || 's',
        createdAt: timePlus(10 * day + 3 * hour),
        updatedAt: timePlus(10 * day + 3 * hour),
      },
      {
        body: 'To work even when I didnt have to!!',
        postSlug: post6?.slug || 's',
        authorName: john?.username || 's',
        createdAt: timePlus(9 * day + hour * 2),
        updatedAt: timePlus(9 * day + hour * 2),
      },
      {
        body: "It's funny cuz it's true haha!",
        postSlug: post8?.slug || 's',
        authorName: john?.username || 's',
        createdAt: timePlus(10 * day + 2 * hour),
        updatedAt: timePlus(10 * day + 2 * hour),
      },
      {
        body: "At least we're enjoying the milk I guess hihi",
        postSlug: post7?.slug || 's',
        authorName: jane?.username || 's',
        createdAt: timePlus(10 * day + 4 * hour),
        updatedAt: timePlus(10 * day + 4 * hour),
      },
      {
        body: 'This is so bad, I dont know why im laughing Hahahaha!!',
        postSlug: post9?.slug || 's',
        authorName: jane?.username || 's',
        createdAt: timePlus(10 * day + 7 * hour),
        updatedAt: timePlus(10 * day + 7 * hour),
      },
    ];

    console.log('📞 Creating comments....');
    await db.comment.create({
      data: comments[0],
    });
    await db.comment.create({
      data: comments[1],
    });
    await db.comment.create({
      data: comments[2],
    });
    await db.comment.create({
      data: comments[3],
    });
    await db.comment.create({
      data: comments[4],
    });
    await db.comment.create({
      data: comments[5],
    });

    const comment1 = await db.comment.findFirst({
      where: {
        authorName: 'john',
      },
    });
    const comment2 = await db.comment.findFirst({
      where: {
        authorName: 'jane',
      },
    });

    const postVotes = [
      {
        value: 1,
        username: john?.username || 'a',
        postId: post9?.identifier || 's',
      },
      {
        value: 1,
        username: jane?.username || 'a',
        postId: post9?.identifier || 's',
      },
      {
        value: 1,
        username: jane?.username || 'a',
        postId: post8?.identifier || 's',
      },
    ];

    const commentVotes = [
      {
        value: 1,
        username: john?.username || 'a',
        commentId: comment1?.id || 's',
      },
      {
        value: 1,
        username: jane?.username || 'a',
        commentId: comment1?.id || 's',
      },
      {
        value: 1,
        username: john?.username || '',
        commentId: comment2?.id || 's',
      },
    ];

    console.log('⬆️  Creating votes...');

    await db.postVote.create({
      data: postVotes[0],
    });
    await db.postVote.create({
      data: postVotes[1],
    });
    await db.postVote.create({
      data: postVotes[2],
    });

    await db.commentVote.create({
      data: commentVotes[0],
    });
    await db.commentVote.create({
      data: commentVotes[1],
    });
    await db.commentVote.create({
      data: commentVotes[2],
    });

    console.log('✅ DB has been seeded successfully');
  } catch (error) {
    console.log(error);
  }
}

main();
