//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
//}}}

int A[1000];
int main(void){
	int N;
	cin >> N;
	rep(i, N) cin >> A[i];
	sort(A, A + N);
	if(N % 2 == 0){
		printf("%.1f\n", (A[N / 2] + A[N / 2 - 1]) / 2.0);
	}else{
		printf("%d\n", A[N / 2]);
	}
	return 0;
}
