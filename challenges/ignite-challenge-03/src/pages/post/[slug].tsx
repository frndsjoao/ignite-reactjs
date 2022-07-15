/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Fragment, useMemo } from 'react';
import PrismicDOM from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const estimatedReadTime = useMemo(() => {
    if (router.isFallback) {
      return 0;
    }

    const wordsPerMin = 200;

    const contentWords = post.data.content.reduce(
      (summedContents, currentContent) => {
        const headingWords = currentContent.heading.split(/\s/g).length;
        const bodyWords = currentContent.body.reduce(
          (summedBodies, currentBody) => {
            const textWords = currentBody.text.split(/\s/g).length;

            return summedBodies + textWords;
          },
          0
        );

        return summedContents + headingWords + bodyWords;
      },
      0
    );

    const min = contentWords / wordsPerMin;
    const readTime = Math.ceil(min);

    return readTime;
  }, [post.data.content, router.isFallback]);

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }
  return (
    <>
      <Header />
      <section
        className={styles.banner}
        data-testid="banner"
        style={{ backgroundImage: `url(${post.data.banner.url})` }}
      />

      <main className={`${commonStyles.mainContainer} ${styles.container}`}>
        <section>
          <h1>{post.data.title}</h1>

          <section>
            <div>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>

            <div>
              <FiUser />
              <span>{post.data.author}</span>
            </div>

            <div>
              <FiClock />
              <span>{estimatedReadTime} min</span>
            </div>
          </section>
        </section>

        <article>
          {post.data.content.map(({ heading, body }) => (
            <Fragment key={heading}>
              <h2>{heading}</h2>

              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: PrismicDOM.RichText.asHtml(body),
                }}
              />
            </Fragment>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;

  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: { post: response },
  };
};
