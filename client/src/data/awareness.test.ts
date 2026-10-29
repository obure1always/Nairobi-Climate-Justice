import { describe, it, expect } from 'vitest';
import { awarenessVideos } from './awarenessVideos';

describe('Climate Change Awareness Videos Dataset', () => {
  it('should have a rich collection of verified videos', () => {
    expect(awarenessVideos.length).toBeGreaterThanOrEqual(6);
  });

  it('every video must have verified metadata, bilingual titles, and descriptions', () => {
    awarenessVideos.forEach((video) => {
      expect(video.id).toBeTruthy();
      expect(video.title.en).toBeTruthy();
      expect(video.title.sw).toBeTruthy();
      expect(video.description.en).toBeTruthy();
      expect(video.description.sw).toBeTruthy();
      expect(video.publisher).toBeTruthy();
      expect(video.publisherBadge).toBeTruthy();
      expect(video.duration).toMatch(/^\d+:\d{2}$/);
      expect(video.durationSeconds).toBeGreaterThan(0);
      expect(video.videoSource).toMatch(/^\/videos\/.+\.webm$/);
      expect(video.sourceUrl).toContain('commons.wikimedia.org');
      expect(video.license).toBeTruthy();
      expect(video.mediaType).toBeTruthy();
    });
  });

  it('must cover all required categories: Kenya impacts, global impacts, and community action', () => {
    const categories = new Set(awarenessVideos.map(v => v.category));
    expect(categories.has('kenya-impacts')).toBe(true);
    expect(categories.has('global-impacts')).toBe(true);
    expect(categories.has('community-action')).toBe(true);
  });

  it('every video must have bilingual practical community actions', () => {
    awarenessVideos.forEach((video) => {
      expect(video.communityAction.en.length).toBeGreaterThan(20);
      expect(video.communityAction.sw.length).toBeGreaterThan(20);
      expect(video.keyTakeaways.en.length).toBeGreaterThanOrEqual(2);
      expect(video.keyTakeaways.sw.length).toBeGreaterThanOrEqual(2);
    });
  });
});
