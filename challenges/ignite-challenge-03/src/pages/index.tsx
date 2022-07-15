/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import Link from 'next/link';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [loadPosts, setLoadPosts] = useState(!!postsPagination.next_page);

  async function handleLoadPosts(): Promise<void> {
    const loadPostsResponse: ApiSearchResponse = await (
      await fetch(postsPagination.next_page)
    ).json();

    setPosts(p => [...p, ...loadPostsResponse.results]);
    setLoadPosts(!!loadPostsResponse.next_page);
  }

  return (
    <div className={`${commonStyles.mainContainer} ${styles.container}`}>
      <header>
        <img src="./logo.svg" alt="logo" />
      </header>

      <main>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a className={styles.post}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <section>
                <div>
                  <FiCalendar />
                  <time>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      { locale: ptBR }
                    )}
                  </time>
                </div>
                <div>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </section>
            </a>
          </Link>
        ))}

        {loadPosts && (
          <button type="button" onClick={handleLoadPosts}>
            Carregar mais posts
          </button>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );

  return {
    props: { postsPagination: postsResponse },
  };
};
