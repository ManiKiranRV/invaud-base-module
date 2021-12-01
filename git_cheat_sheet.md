# Git cheat sheet

## General flow

1. Make sure you have the latest version of main/master/develop\
   `git checkout main`\
   `git pull`
2. Create a new branch\
   `git checkout -b my-cool-branch` (b short for branch)\
3. Write code and create a commit\
   `git add <file>` or if you want to commit al local changes: `git a`\
   `git commit -m '<your commit message, should be very clear and describing>'` (m short for message)\
4. For your first commit, you need to create the remote still, so `git push` won't work\
   `gpsup` (short for `git push --set-upstream`)
5. Make sure you immediately create a pull request. You can mark it as draft, to make sure nobody merges it yet.
6. Make sure you commit regularly and have clear commit messages. Also make sure 1 PR does not get very big. In such a case: split work into different branches/PR's
7. If there have been new commits on the main branch, make sure to rebase
   1. `git checkout main`
   2. `git pull`
   3. `git checkout -` (takes you to your previous branch)
   4. `git rebase main`\
      If you need to fix any conflicts\
      * Resolve conflics in code editor
      * `git a`
      * `git rebase --continue`
      Until all conflicts are resolved
   5. Now you need to push the changes. Because of your rebase, your commit history changes\
      If e.g.
      * main had commits m1 and m2
      * You added commits c1 and c2, so the commit history on your branch is m1, m2, c1, c2
      * Some other changes were added to main: commits m3 and m4
      * You rebased my-cool-branch on main. This caused your new branch history to be:
        m1, m2, m3, m4, c1, c2
        Which means you are changing your commit history (inserting commits instead of appending)
      This means that `git push` will *not* work, so you'll have to use `git push --force-with-lease`. Make sure to **never** push without lease. Pushing with lease checks whether there are any commits on the remote branch (e.g. by a co-worker) which you do not have locally and will refuse to override these.
8. Carry out code review (if the rebase will be very nasty, you could consider reviewing before the rebase)
9. Merge PR
